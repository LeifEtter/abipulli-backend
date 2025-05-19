import { z } from "zod";

export const createDesignSchema = z.object({
  pullover_color: z.string().optional(),
  pullover_model: z.string().optional(),
});

export const placeImageOnDesignSchema = z.object({
  x_position: z.number(),
  y_position: z.number(),
});

export type CreateDesignSchemaType = z.infer<typeof createDesignSchema>;
export const updateDesignSchema = createDesignSchema.extend({});

export type PlaceImageOnDesignSchemaType = z.infer<
  typeof placeImageOnDesignSchema
>;
