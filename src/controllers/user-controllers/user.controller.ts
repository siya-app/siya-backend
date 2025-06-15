import { Request, Response } from "express";
import User from "../../models/user-model/user.model.js";
import { userSchema } from "../../models/user-model/zod/user.schema.js";
// import { log } from "console"; // 'log' from 'console' is usually just console.log
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js"; // Importar la interfaz AuthenticatedRequest


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users); // Mover res.json(users) antes de res.status(200) para asegurar que se envíe la respuesta
  } catch (error: unknown) { // ✅ Tipado de error como unknown
    console.error(`❌ Error fetching users:`, error); // Usar console.error para errores
    
    // Comprobación de tipo para ZodError
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return res
        .status(400) // ZodError suele ser un 400 (Bad Request)
        .json({ error: "❌ Error de validación al obtener usuarios", details: (error as any).errors }); // ✅ Casting a 'any' para acceder a 'errors' si estás seguro
    }

    // Para otros tipos de error, enviar un 500
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};


export const getUserByEmailOrId = async (req: Request, res: Response) => {
  const identifier = req.params.id;

  const uuidV4Regex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  try {
    let user;

    if (uuidV4Regex.test(identifier)) {
      user = await User.findByPk(identifier, {
        attributes: { exclude: ["password_hash"] },
      });
    } else {
      user = await User.findOne({
        where: { email: identifier },
        attributes: { exclude: ["password_hash"] },
      });
    }
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error: unknown) { // ✅ Tipado de error como unknown
    console.error(`❌ Error al obtener usuario ${identifier}:`, error);

    if (typeof error === 'object' && error !== null && 'name' in error && error.name === "ZodError") {
      return res
        .status(400) // ZodError suele ser un 400 (Bad Request)
        .json({ error: "❌ Error de validación al obtener usuario", details: (error as any).errors });
    }

    return res.status(500).json({ error: "Error al obtener usuario" });
  }
};


export const createUser = async (req: Request, res: Response) => { // ✅ Añadir 'res: Response'
  try {
    // Es común que 'createUser' reciba datos del body, no de params para crear un usuario.
    // userSchema.parse(req.params) puede estar mal si los datos vienen en req.body.
    // Asumo que userSchema espera el body.
    const userData = userSchema.parse(req.body); // ✅ Usar req.body en lugar de req.params
    const { name, email, password_hash, birth_date, role } = userData;
    
    console.log("Datos recibidos en el backend para crear usuario:", req.body); 
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      birth_date,
      role: role || "client",
    });

    res.status(201).json(newUser); // ✅ Enviar respuesta de éxito
  } catch (error: unknown) { // ✅ Tipado de error como unknown
    console.error("❌ Error creando usuario:", error);

    if (typeof error === 'object' && error !== null && 'name' in error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "El email ya existe." }); // 409 Conflict
      }
      if (error.name === "ZodError") { // Si userSchema.parse falla
        return res.status(400).json({ error: "Datos de usuario inválidos", details: (error as any).errors });
      }
    }
    return res.status(500).json({ error: "Error interno del servidor al crear usuario." });
  }
};


export const updateUser = async (req: AuthenticatedRequest, res: Response) => { // ✅ Usar AuthenticatedRequest
    const authenticatedUserId = req.user?.id; // Acceso seguro a req.user
    const userIdToUpdate = req.params.id;
    const { password_hash, name, birth_date, newPassword, claimRestaurant } = req.body; 

    try {
        // Validación de autorización: un usuario solo puede actualizar su propio perfil
        if (!authenticatedUserId || authenticatedUserId !== userIdToUpdate ) {
            return res.status(403).json({ error: "Acceso denegado. No tienes permiso para modificar este perfil." });
        }

        const user = await User.findByPk(userIdToUpdate);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Validar la contraseña actual antes de permitir actualizaciones sensibles
        if (!password_hash) {
            return res.status(400).json({ error: "Se requiere la contraseña actual para actualizar el perfil." });
        }
        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña inválida" });
        }

        // Actualizar campos si están presentes en el body
        if (name) {
            user.name = name;
        }
        if (birth_date) {
            user.birth_date = birth_date;
        }
        if (newPassword) {
            // Asegurarse de que newPassword no esté vacío si se proporciona
            if (typeof newPassword !== 'string' || newPassword.length < 6) { // Ejemplo de validación
                return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres." });
            }
            user.password_hash = await bcrypt.hash(newPassword, 10);
        }
        if (claimRestaurant && user.role === 'client') {
            user.role = 'owner'; // Asumimos que 'claimRestaurant' es un booleano para cambiar el rol
        }

        await user.save();
      
        const updatedUser = user.toJSON();
        delete updatedUser.password_hash; // No enviar el hash de la contraseña en la respuesta
        return res.status(200).json(updatedUser);

    } catch (error: unknown) { // ✅ Tipado de error como unknown
        console.error(`❌ Error actualizando perfil de usuario ${userIdToUpdate}:`, error);
        
        // Manejo de errores específicos de Sequelize o validación
        if (typeof error === 'object' && error !== null && 'name' in error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(409).json({ error: "El email ya está en uso." });
            }
            // Puedes añadir más manejo de errores según la necesidad
        }
        return res.status(500).json({ error: "Error interno del servidor al actualizar usuario." });
    }
};


export const deleteUser = async (req: AuthenticatedRequest, res:Response) => { // ✅ Usar AuthenticatedRequest
    const authenticatedUserId = req.user?.id; // Acceso seguro a req.user
    const userIdToDelete = req.params.id;
    const { password_hash } = req.body; // Se espera la contraseña para confirmar la eliminación

    try {
        // Validación de autorización: un usuario solo puede eliminar su propia cuenta
        if (!authenticatedUserId || authenticatedUserId !== userIdToDelete) { 
            return res.status(403).json({ error: "Acceso denegado. No tienes permiso para eliminar esta cuenta." });
        }

        const user = await User.findByPk(userIdToDelete); 
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." }); 
        }

        // Validar la contraseña actual para confirmar la eliminación
        if (!password_hash) {
            return res.status(400).json({ error: "Se requiere la contraseña para confirmar la eliminación." });
        }
        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña inválida." });
        }

        await user.destroy();
        return res.status(200).json({ message: 'Perfil eliminado exitosamente' });

    } catch (error: unknown) { // ✅ Tipado de error como unknown
        console.error(`❌ Error eliminando usuario ${userIdToDelete}:`, error);

        if (typeof error === 'object' && error !== null && 'name' in error) {
            if (error.name === "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({ error: "No se puede eliminar el usuario. Existen reservas o restaurantes asociados.", details: (error as any).message });
            }
        }
        return res.status(500).json({ error: "Error interno del servidor al eliminar el usuario." });
    }
};
