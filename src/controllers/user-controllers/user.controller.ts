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
        .json({ error: "❌ Error de validació a l'obtenir usuaris", details: (error as any).errors });
    }

    return res.status(500).json({ error: "Error a l'obtenir usuaris" });
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
      return res.status(404).json({ error: "Usuari no trobat" });
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    console.error(`❌ Error a l'obtenir usuari ${identifier}:`, error);

    if (typeof error === 'object' && error !== null && 'name' in error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "❌ Error de validació a l'obtenir usuari", details: (error as any).errors });
    }

    return res.status(500).json({ error: "Error a l'obtenir usuari" });
  }
};

export const getLoggedInUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('--- getLoggedInUserProfile ---');
      
      
      if (!req.user || !req.user.id) {
        
          return res.status(401).json({ message: "No autoritzat: Informació d'usuario no disponible." });
      }

      const userId = req.user.id;
      
      const user = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } }); 

      if (!user) {
        console.log('Debug: Perfil de usuari no trobat a la base de dades per ID:', userId);
          return res.status(404).json({ message: 'Perfil de usuari no trobat.' });
      }

      res.status(200).json(user);
    } catch (error) {
        console.error("Error a l'obtenir perfil del usuario logueado:", error);
        res.status(500).json({ message: "Error del servidor a l'obtenir el perfil." });
    }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = userSchema.parse(req.body);
    const { name, email, password_hash, birth_date, role } = userData;
    
     
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
    console.error("❌ Error al crear usuari:", error);

    if (typeof error === 'object' && error !== null && 'name' in error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "Aquest email ja existeix." });
      }
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Dades d'usuari invàlides", details: (error as any).errors });
      }
    }
    return res.status(500).json({ error: "Error intern del servidor al crear usuari." });
  }
};


export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const userIdToUpdate = req.params.id;
  const { name, currentPassword, newPassword } = req.body;

  try {
   
    if (!authenticatedUserId || authenticatedUserId !== userIdToUpdate) {
      return res.status(403).json({ error: "No tens permisos per modificar aquest perfil." });
    }

   
    const user = await User.findByPk(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat." });
    }

    
    if (!currentPassword) {
      return res.status(400).json({ error: "Has d'introduir la contrasenya actual per actualitzar el perfil." });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "La contrasenya actual és incorrecta." });
    }

    
    if (name) {
      user.name = name;
    }

    
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "La nueva contrasenya ha de contenir com a mínim 8 caràcters." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_hash = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Perfil actualitzat correctament.",
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
    console.error("❌ Error actualitzant perfil:", error);
    res.status(500).json({ error: "Error intern del servidor a l'actualitzar el perfil." });
  }
};



export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedUserId = req.user?.id;
    const userIdToDelete = req.params.id;
    const { password_hash } = req.body;

    try {
        if (!authenticatedUserId || authenticatedUserId !== userIdToDelete) {
            return res.status(403).json({ error: "No tens permisos per eliminar aquest compte." });
        }

        const user = await User.findByPk(userIdToDelete);
        if (!user) {
            return res.status(404).json({ error: "Usuari no trobat." });
        }

        if (!password_hash) {
            return res.status(400).json({ error: "Es requereix la contrasenya per confirmar l'eliminació." });
        }

        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contrasenya invàlida." });
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

        return res.status(200).json({ message: 'Perfil eliminat exitosament' });

    } catch (error: unknown) {
        console.error(`❌ Error eliminant usuari ${userIdToDelete}:`, error);

        if (typeof error === 'object' && error !== null && 'name' in error) {
            if ((error as any).name === "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({ error: "No s'ha pogut eliminar aquest usuari. Hi hi associacions actives.", details: (error as any).message });
            }
        }
        return res.status(500).json({ error: "Error intern del servidor a l'eliminar l'usuari." });
    }
};

//-----Claiming a terrce------//

export const claimTerraceOwnership = async (req, res) => {
  try {
    const { userId } = req.params;
    const { terraceId } = req.body;

       console.log("Iniciando claimTerraceOwnership", { userId, terraceId });

    const user = await User.findByPk(userId);
    console.log("Usuario encontrado en DB:", user?.id, user?.role);
    if (!user) {
    
      return res.status(404).json({ message: 'Usuari no trobat.' });
    }

    const terrace = await Terrace.findByPk(terraceId);
    if (!terrace) {
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
    const updatedUser = await user.update({
      role: 'owner',
      id_terrace: terrace.id,
      // Solo incluye restaurantId si decides mantenerlo en el modelo User y quieres asignarle un valor
      // de la terraza, o si lo eliminas, simplemente no lo pases aquí.
      restaurantId: restaurantIdToAssign // Pasa el valor si es relevante
    });

    await terrace.update({
      is_claimed: true
    });

    res.status(200).json({
      message: "Enhorabona! Ara ets el propietari d'aquesta terrassa",
      user: { 
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        id_terrace: updatedUser.id_terrace,
     
      }
    });
  } catch (error: unknown) {
    console.error("Error al reclamar la propietat de la terrassa:", error);
    if (typeof error === 'object' && error !== null && 'name' in error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('❌ Error de FK:', (error as any).fields, (error as any).value);
        } else if (error.name === 'SequelizeUniqueConstraintError') {
             console.error('❌ Error de restricció única:', (error as any).fields, (error as any).value);
        }
    }
    res.status(500).json({ message: 'Error intern del servidor al reclamar la propietat de la terrassa.' });
  }
};
