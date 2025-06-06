import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password_hash: z.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
  birth_date: z.string()
    .datetime()
});

export type UserSchema = z.infer<typeof userSchema>;