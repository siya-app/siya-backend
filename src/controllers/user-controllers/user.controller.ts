import { Request, Response } from 'express';
import User from '../../models/user-model/user.model.js';
import { userSchema } from '../../models/user-model/zod/user.schema.js';


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.json(users);
        res.status(200);

    } catch (error: any) {
        console.log(`Error fetching users: error ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error fetching users", details: error.errors })
        }

        console.error(`❌ Error fetching users:`, error);
        return res.status(500).json({ error: "Error fetching users" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const userID = req.params.id;
    

    if (!userID) {
        return res.status(400).json({ error: "Invalid or nonexistent user ID" });
    }

    try {
        const user = await User.findByPk(userID);
        

        if (!user) {
            return res.status(404).json({ error: "User ID not found" });
        }
        res.status(200).json(user);

    } catch (error: any) {
        console.log(`Error fetching user ID ${userID}: error ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error fetching user", details: error.errors })
        }

        console.error(`❌ Error fetching user:`, error);
        return res.status(500).json({ error: "Error fetching user" });
    }
};
//Function creta returns error.

// export const createUser = async (req: Request, res: Response) => {

//     try {
//         // const userData = userSchema.parse(req.body);
//         const userData = req.body


//         if (!userData) {
//             return res.status(204).json({ error: "Invalid user" });
//         }
//         console.log("💡 User data validated:", userData);

//         const createdUser = await User.create(userData);
//         return res.status(201).json(createdUser);

//     } catch (error: any) {
//         if (error.name === "ZodError") {
//             console.error("🔥 FULL ERROR:", error);
//             return res.status(400).json({ error: "❌ Validation failed", details: error.errors });
//         }

//         console.error(`❌ Error adding user:`, error);
//         return res.status(500).json({ error: "Error adding user" });
//     }
// };
//**********--------------------------------- */
export const createUser = async (req: Request) => {
  try {
    const { name, email, password_hash, birth_date, role } = req.params;

    // Puedes añadir validaciones adicionales aquí (ej. formato de email, complejidad de password)

    // Hashear la contraseña antes de guardarla (¡MUY IMPORTANTE!)
    // const hashedPassword = await bcrypt.hash(password, 10); // Asumiendo que usas bcrypt

    const newUser = await User.create({
      name,
      email,
      password_hash, //hashedPassword, // Usa la contraseña hasheada
      birth_date,
      role: role || 'client', // Por defecto el rol es 'client' si no se especifica
    });

    return newUser; // Devuelve el nuevo usuario creado
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('El email ya está registrado.');
    }
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};



//--------------------------------------------------------

export const updateUser = async (req: Request, res: Response) => {
    const userID = req.params.id;
    const updateData = req.body; // Assuming the update data is sent in the request body

    if (!userID) {
        return res.status(400).json({ error: "Invalid or nonexistent user ID" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No update data provided" });
    }

    try {
        const [updatedRows] = await User.update(updateData, { 
            where: { id: userID } 
        });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "User not found or no changes were made" });
        }

        res.status(200).json({ 
            message: "User updated successfully",
            userID,
            updatedFields: updateData
        });

    } catch (error: any) {
        console.error(`Error updating user ID ${userID}: ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ 
                error: "❌ Error updating user", 
                userID, 
                details: error.errors
            });
        }
        
        console.error(`❌ Error updating user:`, error);
        return res.status(500).json({ 
            error: "Error updating user",
            message: error.message 
        });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    const userID = req.params.id;

    if (!userID) {
        return res.status(400).json({ error: "Invalid or nonexistent user ID" })
    }

    try {
        await User.destroy({ where: { id: userID } });
        res.sendStatus(200);

    } catch (error: any) {
        console.error(`Error deleting user ID ${userID}: ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error deleting user", userID, details: error.errors});
        }
        console.error(`❌ Error adding user:`, error);
        return res.status(500).json({ error: "Error deleting user" });
    }
};