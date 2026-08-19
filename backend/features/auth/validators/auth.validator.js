import { z } from "zod";
// Thrown ZodErrors are auto-normalized to a 400 ValidationError by
// createErrorMiddleware — no manual try/catch or error mapping needed here.

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const totpTokenSchema = z.object({
  totpToken: z.string().length(6, "Authenticator code must be 6 digits"),
});
