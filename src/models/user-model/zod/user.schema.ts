import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
   age: z.number().int().positive("La edad debe ser un número entero positivo.")
});

export type UserSchema = z.infer<typeof userSchema>;