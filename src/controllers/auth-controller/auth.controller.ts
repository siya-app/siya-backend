import { Request, Response } from 'express';
import User from '../../models/user-model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {isTokenValid} from '../../app.js'

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'supersecretdefaultkey';
const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');
const JWT_EXPIRES_IN = '1d';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password_hash } = req.body;

    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN } 
    );

    
    res.status(200).json({
      message: 'Successfully signed in',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(`❌ Error logging in user:`, error);
    return res.status(500).json({ error: 'Error signing in.' });
  }
};