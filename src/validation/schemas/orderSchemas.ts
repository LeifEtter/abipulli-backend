import { z } from "zod";

export const orderCreateUpdateSchema = z.object({
  school_name: z.string().optional(),
  destination_country: z.string().optional(),
  student_amount: z.number().optional(),
  deadline: z.string().optional(),
  motto: z.string().optional(),
});

export type UserOrderCreateUpdateType = z.infer<typeof orderCreateUpdateSchema>;

export const orderUpdateSchema = orderCreateUpdateSchema.extend({});
