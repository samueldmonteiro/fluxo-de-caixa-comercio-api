import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z.string().max(100).optional().nullable()
});

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
