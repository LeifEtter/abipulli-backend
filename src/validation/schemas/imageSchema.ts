import { z } from "zod";

export const improveImageQuerySchema = z.object({
  theme: z.string(),
  description: z.string().optional(),
  styles: z.array(z.string()),
});

export type ImproveImageQuerySchemaType = z.infer<
  typeof improveImageQuerySchema
>;

export const generateImageSchema = z.object({
  prompt: z.string(),
  style_tags: z.array(z.string()),
});

export type GenerateImageSchemaType = z.infer<typeof generateImageSchema>;
