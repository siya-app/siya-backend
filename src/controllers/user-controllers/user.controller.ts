import { Request, Response } from "express";
import User from "../../models/user-model/user.model.js";
import { userSchema } from "../../models/user-model/zod/user.schema.js";
import { log } from "console";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bcrypt from "bcrypt";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
    res.status(200);
  } catch (error: any) {
    console.log(`Error fetching users: error ${error}`);

    if (error.name === "ZodError") {
      return res
        .status(500)
        .json({ error: "❌ Error fetching users", details: error.errors });
    }

    console.error(`❌ Error fetching users:`, error);
    return res.status(500).json({ error: "Error fetching users" });
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
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error fetching user : ${identifier}: error ${error}`);

    if (error.name === "ZodError") {
      return res
        .status(500)
        .json({ error: "❌ Error fetching user", details: error.errors });
    }

    console.error(`❌ Error fetching user:`, error);
    return res.status(500).json({ error: "Error fetching user" });
  }
};


//**********--------------------------------- */
export const createUser = async (req: Request) => {
  try {
    const { name, email, password_hash, birth_date, role } = userSchema.parse(
      req.params
    );

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      birth_date,
      role: role || "client",
    });

    return newUser;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Existing email.");
    }
    throw new Error("Error creating user: " + error.message);
  }
};

//--------------------------------------------------------
export const updateUser = async (req: Request, res: Response) => {
    const authenticatedUserId = req.user?.id;
    const userIdToUpdate = req.params.id;
    const { password_hash, name, birth_date, newPassword, claimRestaurant } = req.body; 

    try {
        
        if (authenticatedUserId !== userIdToUpdate ) {
            return res.status(403).json({ error: "Access denied. You don't have permission to modify this profile." });
        }

        const user = await User.findByPk(userIdToUpdate);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        
        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        
        if (name) {
            user.name = name;
        }
        if (birth_date) {
            user.birth_date = birth_date;
        }
        if (newPassword) {
            user.password_hash = await bcrypt.hash(newPassword, 10);
        }
        if (claimRestaurant && user.role === 'client') {
            user.role = 'owner';
        }

        await user.save();
     
        const updatedUser = user.toJSON();
        delete updatedUser.password_hash; 
        return res.status(200).json(updatedUser);

    } catch (error: any) {
        console.error(`❌ Error updating user profile ${userIdToUpdate}:`, error);
      
        return res.status(500).json({ error:"Server error" });
    }
};

//---------------------------------------------------------*****--------------//


export const deleteUser = async (req: Request, res:Response) => {
  const authenticatedUserId = req.user?.id;
  const userIdToDelete = req.params.id;
    const { password_hash } = req.body;

    try {
        
        if (authenticatedUserId !== userIdToDelete) { 
             return res.status(403).json({ error: "Access denied. You don't have permission to delete this account." });
        }


        const user = await User.findByPk(userIdToDelete); 
        if (!user) {
            return res.status(404).json({ error: "User not found." }); 
        }

        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash); // 
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." });
        }

        await user.destroy();
        return res.status(200).json({ message: 'Profile deleted' });

    } catch (error: any) {
        console.error(`❌ Error deleting user ${userIdToDelete}:`, error);

        if (error.name === "SequelizeForeignKeyConstraintError") {
             return res.status(400).json({ error: "No se puede eliminar el usuario. Existen reservas o restaurantes asociados.", details: error.message });
        }
        return res.status(500).json({ error: "Error interno del servidor al eliminar el usuario." });
    }
};

  