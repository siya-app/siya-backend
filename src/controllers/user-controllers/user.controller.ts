import { Request, Response } from "express";
import User from "../../models/user-model/user.model.js";

import { userSchema } from "../../models/user-model/zod/user.schema.js";
// import { log } from "console"; // 'log' from 'console' is usually just console.log
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js"; // Importar la interfaz AuthenticatedRequest
import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";


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

export const getLoggedInUserProfile = async (req, res) => {
    try {
      console.log('--- getLoggedInUserProfile ---');
        console.log('req.user en getLoggedInUserProfile (antes de la verificación):', req.user);
        // Asumiendo que isTokenValid añade el ID del usuario (o el objeto completo del usuario) a `req.user`
        // por ejemplo: req.user = { id: 'someUserId', email: 'user@example.com', ... };
        if (!req.user || !req.user.id) {
          console.log('Debug: req.user o req.user.id es nulo/indefinido.');
            return res.status(401).json({ message: 'No autorizado: Información de usuario no disponible.' });
        }

        const userId = req.user.id; // Obtenemos el ID del usuario del token validado
        console.log('User ID from req.user:', userId);
        const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } }); // Busca el usuario por ID, excluyendo la contraseña
        // O si estás usando `getUserByEmailOrId` en tu controlador y puede tomar un ID directamente:
        // const user = await getUserByEmailOrId(userId); // Adaptar si getUserByEmailOrId no es una función simple

        if (!user) {
          console.log('Debug: Perfil de usuario no encontrado en la base de datos para ID:', userId);
            return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });
        }

        res.status(200).json(user); // Devuelve los datos del perfil del usuario
    } catch (error) {
        console.error('Error al obtener perfil del usuario logueado:', error);
        res.status(500).json({ message: 'Error del servidor al obtener el perfil.' });
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

//-----Claiming a terrce------//

export const claimTerraceOwnership = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { terraceId } = req.body; // El ID de la terraza se envía en el cuerpo de la solicitud
    console.log("Iniciando claimTerraceOwnership", { userId, terraceId });
    // 1. Validar que el usuario y la terraza existan
    const user = await User.findByPk(userId);
    console.log("Usuario encontrado en DB:", user?.id, user?.role);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const terrace = await Terrace.findByPk(terraceId);
    console.log("Terrace:", terrace?.id, terrace?.is_claimed);
    if (!terrace) {
      return res.status(404).json({ message: 'La terrassa especificada no existeix.' });
    }

    // 2. Verificar si la terraza ya tiene un dueño
    const existingOwner = await User.findOne({
      where: {
        id_terrace: terraceId, // Busca si hay algún usuario que ya sea dueño de esta terraza
        role: 'owner'
      }
    });

    if (existingOwner) {
      if (existingOwner.id === userId) {
          return res.status(200).json({ message: "Ja ets el propietari d'aquesta terrassa." });
      }
      return res.status(409).json({ message: "Aquesta terrassa ja s'ha reclamat per un altre usuari."});
    }

    // 3. Verificar si el usuario ya es dueño de otra terraza
    // Un usuario solo puede ser dueño de una terraza.
    if (user.role === 'owner' && user.id_terrace !== null) {
      return res.status(409).json({ message: "Ja ets propitari d'una terrssa. Cada usuari només por reclamar una terrassa."});
    }

    // 4. (Eliminar/Simplificar) Obtener el restaurantId de la terraza
    // Si no tienes un modelo Restaurant, y el campo restaurantId en User no es relevante o se elimina,
    // simplemente no lo incluyas en la actualización del usuario.
    // Si tu tabla `terraces` *sí* tiene un campo `restaurantId` (aunque no sea una referencia a otra tabla),
    // y quieres copiar ese valor al usuario, entonces SÍ lo mantendrías y lo copiarías desde `terrace.restaurantId`.
    // Por ejemplo, si el restaurantId en la tabla terrace es simplemente un identificador único (UUID o STRING)
    // que viene de algún sistema externo o que generas para agrupar terrazas.

    let restaurantIdToAssign = null; // Inicializamos a null por si no lo usamos

    // // Si tu modelo `Terrace` tiene un `restaurantId` y quieres que el `User` también lo tenga (aunque no referencie una tabla `Restaurant`):
    // // Ejemplo: `Terrace` tiene un campo `restaurant_identifier: DataTypes.UUID`
    // if (terrace.restaurantId) { // Asegúrate de que el nombre del campo en tu modelo Terrace sea correcto, ej. terrace.restaurantId
    //     restaurantIdToAssign = terrace.restaurantId;
    // }


    // 5. Actualizar el usuario
    // const updatedUser = await user.update({
    //   role: 'owner',
    //   id_terrace: terrace.id,
    //   // Solo incluye restaurantId si decides mantenerlo en el modelo User y quieres asignarle un valor
    //   // de la terraza, o si lo eliminas, simplemente no lo pases aquí.
    //   //restaurantId: terrace.id // Pasa el valor si es relevante
    // });
console.log("Preparando actualización del usuario...");
    user.role = 'owner';
user.id_terrace = terrace.id;
await user.save(); 
console.log("Usuario actualizado:", user.toJSON());
    await user.reload(); // Vuelve a traer los datos de la base de datos
console.log("Reloaded user:", user.id_terrace);

    

    await terrace.update({
      is_claimed: true
    });
console.log("Terrace marcado como reclamado");
    res.status(200).json({
      message: "Enhorabona! Ara ets el propietari d'aquesta terrassa",
      
      user: { 
        id: user.id,
        email: user.email,
        role: user.role,
        id_terrace: user.id_terrace,
     
      }
    });
  } catch (error) {
    console.error("Error al reclamar la propietat de la terrassa:", error);
    res.status(500).json({ message: 'Error intern del servidor al reclamar la propietat de la terrassa.' });
  }
};