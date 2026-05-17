import { z } from "zod";
import { imageSource } from "@/backend/schemas/shared";

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, "Enter customer name"),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().min(10, "Add a longer review"),
  purchaseLocation: z.string().trim().min(3, "Enter purchase location"),
  purchaseDate: z.string().min(8, "Enter purchase date"),
  photo: imageSource,
  videoPlaceholder: z.string().trim().min(3, "Add a video note"),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
