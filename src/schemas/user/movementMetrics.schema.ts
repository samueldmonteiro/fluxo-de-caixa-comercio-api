import { z } from "zod";

export const movementMetricsSchema = z.object({
startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type MovementMetricsDTO = z.infer<typeof movementMetricsSchema>;
