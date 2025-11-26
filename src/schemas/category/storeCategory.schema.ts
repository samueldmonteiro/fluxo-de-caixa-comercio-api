import { z } from "zod";

export const storeCategorySchema = z.object({
  name: z.string().max(100)
});

export type StoreCategoryDTO = z.infer<typeof storeCategorySchema>;
