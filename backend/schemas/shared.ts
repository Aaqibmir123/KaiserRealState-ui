import { z } from "zod";

export const imageSource = z
  .string()
  .trim()
  .min(1, "Upload an image")
  .refine((value) => /^(https?:\/\/|data:image\/|\/)/.test(value), "Upload a valid image");
