import { z } from "zod";

export const createLoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginDTO = z.infer<typeof createLoginSchema>;
