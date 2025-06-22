import { Request, Response } from "express";
import User from "../../models/user-model/user.model.js";
import { userSchema } from "../../models/user-model/zod/user.schema.js";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js" 
import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js"; 

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error: unknown) {
    console.error(`❌ Error fetching users:`, error);
    
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return res
        .status(400)
        .json({ error: "❌ Error de validación al obtener usuarios", details: (error as any).errors });
    }

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
  } catch (error: unknown) {
    console.error(`❌ Error al obtener usuario ${identifier}:`, error);

    if (typeof error === 'object' && error !== null && 'name' in error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "❌ Error de validación al obtener usuario", details: (error as any).errors });
    }

    return res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const getLoggedInUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('--- getLoggedInUserProfile ---');
      console.log('req.user en getLoggedInUserProfile (antes de la verificación):', req.user);
      
      if (!req.user || !req.user.id) {
        console.log('Debug: req.user o req.user.id es nulo/indefinido.');
          return res.status(401).json({ message: 'No autorizado: Información de usuario no disponible.' });
      }

      const userId = req.user.id;
      console.log('User ID from req.user:', userId);
      const user = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } }); 

      if (!user) {
        console.log('Debug: Perfil de usuario no encontrado en la base de datos para ID:', userId);
          return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });
      }

      res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener perfil del usuario logueado:', error);
        res.status(500).json({ message: 'Error del servidor al obtener el perfil.' });
    }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = userSchema.parse(req.body);
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

    res.status(201).json(newUser);
  } catch (error: unknown) {
    console.error("❌ Error creando usuario:", error);

    if (typeof error === 'object' && error !== null && 'name' in error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "El email ya existe." });
      }
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Datos de usuario inválidos", details: (error as any).errors });
      }
    }
    return res.status(500).json({ error: "Error interno del servidor al crear usuario." });
  }
};


export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const userIdToUpdate = req.params.id;
  const { name, currentPassword, newPassword } = req.body;

  try {
    // Verificar identidad del usuario
    if (!authenticatedUserId || authenticatedUserId !== userIdToUpdate) {
      return res.status(403).json({ error: "No tienes permiso para modificar este perfil." });
    }

    // Buscar usuario
    const user = await User.findByPk(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Verificar contraseña actual
    if (!currentPassword) {
      return res.status(400).json({ error: "Debes introducir la contraseña actual para actualizar el perfil." });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "La contraseña actual es incorrecta." });
    }

    // Actualizar nombre (si se proporciona)
    if (name) {
      user.name = name;
    }

    // Actualizar contraseña (si se proporciona)
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_hash = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Perfil actualizado correctamente.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        role: user.role,
        id_terrace: user.id_terrace
      }
    });
  } catch (error) {
    console.error("❌ Error actualizando perfil:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar el perfil." });
  }
};



export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedUserId = req.user?.id;
    const userIdToDelete = req.params.id;
    const { password_hash } = req.body;

    try {
        if (!authenticatedUserId || authenticatedUserId !== userIdToDelete) {
            return res.status(403).json({ error: "Acceso denegado. No tienes permiso para eliminar esta cuenta." });
        }

        const user = await User.findByPk(userIdToDelete);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        if (!password_hash) {
            return res.status(400).json({ error: "Se requiere la contraseña para confirmar la eliminación." });
        }

        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña inválida." });
        }

        // 🧼 Si el usuario es owner y tiene una terraza reclamada, libérala
        if (user.role === 'owner' && user.id_terrace) {
            const terrace = await Terrace.findByPk(user.id_terrace);
            if (terrace) {
                terrace.is_claimed = false;
                await terrace.save();
            }
        }

        await user.destroy();

        return res.status(200).json({ message: 'Perfil eliminado exitosamente' });

    } catch (error: unknown) {
        console.error(`❌ Error eliminando usuario ${userIdToDelete}:`, error);

        if (typeof error === 'object' && error !== null && 'name' in error) {
            if ((error as any).name === "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({ error: "No se puede eliminar el usuario. Existen asociaciones activas.", details: (error as any).message });
            }
        }
        return res.status(500).json({ error: "Error interno del servidor al eliminar el usuario." });
    }
};

export const claimTerraceOwnership = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { terraceId } = req.body;

    console.log(`[CLAIM] Intentando reclamar terrassa: userId=${userId}, terraceId=${terraceId}`);

    const user = await User.findByPk(userId);
    if (!user) {
      console.log(`[CLAIM] Usuario ${userId} no encontrado.`);
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    console.log(`[CLAIM] Usuario encontrado: ${user.email}, rol actual: ${user.role}, id_terrace actual: ${user.id_terrace}`);

    // ✅ CAMBIO CLAVE: Usar { raw: true } para obtener un objeto plano
    const rawTerrace = await Terrace.findByPk(terraceId, { raw: true }); 
    
    // ✅ Ahora 'rawTerrace' es un objeto plano, no una instancia de modelo.
    // Esto significa que las propiedades serán accesibles directamente, sin las interferencias del 'public'.
    if (!rawTerrace) {
      console.log(`[CLAIM] Terrassa ${terraceId} no encontrada.`);
      return res.status(404).json({ message: 'La terrassa especificada no existeix.' });
    }
    // Convertir rawTerrace a un tipo conocido o usar aserciones si es necesario
    const terrace = rawTerrace as { id: string, business_name: string, is_claimed: boolean }; 

    console.log(`[CLAIM] OBJETO TERRACE COMPLETO (RAW):`, terrace); // Imprime el objeto plano
    console.log(`[CLAIM] ¿Es terrace una instancia del modelo Terrace?:`, terrace instanceof Terrace); // Esto debería ser FALSE ahora
    
    console.log(`[CLAIM] Terrassa encontrada: ${terrace.business_name}, is_claimed: ${terrace.is_claimed}`);


    const existingOwner = await User.findOne({
      where: {
        id_terrace: terrace.id, // ✅ Usar terrace.id del objeto plano
        role: 'owner'
      }
    });

    if (existingOwner) {
      if (existingOwner.id === userId) {
          console.log(`[CLAIM] Usuario ${userId} ya es propietario de esta terrassa.`);
          return res.status(200).json({ message: "Ja ets el propietari d'aquesta terrassa." });
      }
      console.log(`[CLAIM] Terrassa ${terrace.id} ya reclamada por otro usuario: ${existingOwner.id}.`); // ✅ Usar terrace.id
      return res.status(409).json({ message: "Aquesta terrassa ja s'ha reclamat per un altre usuari."});
    }

    if (user.role === 'owner' && user.id_terrace !== null) {
      console.log(`[CLAIM] Usuario ${userId} ya es propietario de otra terrassa: ${user.id_terrace}.`);
      return res.status(409).json({ message: "Ja ets propitari d'una terrassa. Cada usuari només pot reclamar una terrassa."}); 
    }
    
    console.log(`[CLAIM] Antes de actualizar usuario ${user.id}:`);
    console.log(`[CLAIM]   id_terrace actual: ${user.id_terrace}`);
    console.log(`[CLAIM]   role actual: ${user.role}`);
    console.log(`[CLAIM]   Intentando asignar id_terrace: ${terrace.id}`); // ✅ Usar terrace.id
    console.log(`[CLAIM]   Tipo de terrace.id: ${typeof terrace.id}`);


    const updatedUser = await user.update({
      role: 'owner',
      id_terrace: terrace.id, // ✅ Usar terrace.id del objeto plano
    });

    console.log(`[CLAIM] Después de actualizar usuario ${user.id}:`);
    console.log(`[CLAIM]   id_terrace nuevo (desde objeto user): ${updatedUser.id_terrace}`);
    console.log(`[CLAIM]   role nuevo (desde objeto user): ${updatedUser.role}`);


    // Si terrace.is_claimed es null/undefined en el objeto plano, asegúrate de que no cause un error.
    // Solo actualiza si la propiedad existe y no es ya true.
    if (terrace.is_claimed === false || terrace.is_claimed === undefined || terrace.is_claimed === null) {
        await Terrace.update(
            { is_claimed: true },
            { where: { id: terrace.id } } // ✅ Aquí actualizamos por el ID de la terraza
        );
        console.log(`[CLAIM] Terrassa ${terrace.id} marcada como reclamada.`);
    } else {
        console.log(`[CLAIM] Terrassa ${terrace.id} ya estaba marcada como reclamada, no se hizo update.`);
    }


    res.status(200).json({
      message: "Enhorabona! Ara ets el propietari d'aquesta terrassa",
      user: { 
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name, 
        role: updatedUser.role,
        id_terrace: updatedUser.id_terrace as string | null, 
      }
    });
  } catch (error: unknown) {
    console.error("Error al reclamar la propietat de la terrassa:", error);
    if (typeof error === 'object' && error !== null && 'name' in error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('❌ Error de clave foránea:', (error as any).fields, (error as any).value);
        } else if (error.name === 'SequelizeUniqueConstraintError') {
             console.error('❌ Error de restricción única:', (error as any).fields, (error as any).value);
        }
    }
    res.status(500).json({ message: 'Error intern del servidor al reclamar la propietat de la terrassa.' });
  }
};
