import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

export type UserRegistrationSchemaType = z.infer<typeof userRegistrationSchema>;

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UserLoginSchemaType = z.infer<typeof userLoginSchema>;
