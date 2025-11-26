import { z } from "zod";

export const storeMovementSchema = z.object({
  value: z.number(),
  description: z.string().optional().nullable(),
  type: z.enum(['EXPENSE', 'INCOME']),
  categoryId: z.number().optional().nullable(),
  categoryName: z.string().optional().nullable()
});

export type StoreMovementDTO = z.infer<typeof storeMovementSchema>;
