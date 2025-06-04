import z from 'zod'
export const bookingSchema = z.object({
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  booking_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  party_length: z.number().int().positive("The party length should be a positive integer"),
  has_shown: z.boolean().optional(), 
  user_id: z.string().uuid("Invalid UUID"),
});
export type bookingInput=z.infer<typeof bookingSchema>