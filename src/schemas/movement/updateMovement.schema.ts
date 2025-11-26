import { z } from "zod";

export const updateMovementSchema = z.object({
  value: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  type: z.enum(['EXPENSE', 'INCOME']).optional().nullable(),
  categoryId: z.number().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  date: z.date().optional().nullable()
});

export type UpdateMovementDTO = z.infer<typeof updateMovementSchema>;
