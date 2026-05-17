import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter email or phone"),
  password: z.string().min(6, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
