import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password_hash: z.string().min(8),
  birth_date: z.string()
});

export type UserSchema = z.infer<typeof userSchema>;