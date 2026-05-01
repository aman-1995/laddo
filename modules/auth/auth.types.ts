import { z } from "zod";

export const SessionUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});

export type SessionUser = z.infer<typeof SessionUserSchema>;
