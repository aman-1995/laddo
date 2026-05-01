import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")
    .optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
