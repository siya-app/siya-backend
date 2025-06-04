import { Request, Response } from 'express';
import User from '../../models/user-model/user.model.js';
import { userSchema } from '../../models/user-model/zod/user.schema.js';

export async function createUser(req: Request, res: Response) {
  const parsed = userSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const user = await User.create(parsed.data);
    return res.status(201).json(user.toJSON());
  } catch (error: any) {
    console.error('❌ Error al crear usuario:', error);

    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
      dbError: error.parent?.detail, // si es error de Postgres vía Sequelize
    });
  }
}