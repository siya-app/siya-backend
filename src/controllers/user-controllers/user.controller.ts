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

export const updateUser = async (
  email: string,
  currentPassword: string,
  req: Request,
  res: Response
) => {
  const updateData = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("❌ User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isPasswordValid) {
      throw new Error("❌ Invalid password");
    }
    if (updateData.name) {
      user.name = updateData.name;
    }
    if (updateData.birthdate) {
      user.birth_date = updateData.birthdate;
    }
    if (updateData.newPassword) {
      user.password_hash = await bcrypt.hash(updateData.newPassword, 10);
    }
    if (updateData.claimRestaurant && user.role === "client") {
      user.role = "owner";
    }
    await user.save();
    return user;
  } catch (error) {
 
    if (error.name === "ZodError") {
      return res.status(500).json({
        error: "❌ Error updating user",
        details: error.errors,
      });
    }

    console.error(`❌ Error updating user:`, error);
    return res.status(500).json({
      error: "Error updating user",
      message: error.message,
    });
  }
};

//---------------------------------------------------------*****--------------//


export const deleteUser = async (email: string, password_hash: string, req: Request, res:Response) => {
    try {
        const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).json({ error: "Invalid or nonexistent user ID" });
    }
    const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid password" });
    }
    await user.destroy();
    res.sendStatus(200);
    } catch (error: any) {
    console.error(`Error deleting user ${email}: ${error}`);

    if (error.name === "ZodError") {
      return res
        .status(500)
        .json({
          error: "❌ Error deleting user",
          email,
          details: error.errors,
        });
    }
    console.error(`❌ Error deleting user:`, error);
    return res.status(500).json({ error: "Error deleting user" });
  }}