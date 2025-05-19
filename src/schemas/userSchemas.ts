import { isIP } from "net";
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

export const anonymousLoginSchema = z.object({
  ip_address: z.string().refine((str) => isIP(str)),
  fingerprint_info: z.object({}).optional(),
});

export type AnonymousLoginSchema = z.infer<typeof anonymousLoginSchema>;

export const googleSignOnSchema = z.object({
  google_id: z.string(),
});

export type GoogleSignOnSchema = z.infer<typeof googleSignOnSchema>;
