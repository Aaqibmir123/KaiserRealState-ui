import { z } from "zod";
import { imageSource } from "@/backend/schemas/shared";

export const soldSchema = z.object({
  buyerName: z.string().trim().min(2, "Enter client name"),
  saleDate: z.string().min(8, "Enter sale date"),
  salePrice: z.string().trim().min(1, "Enter sale price"),
  contactPhone: z.string().trim().min(8, "Enter contact phone"),
  location: z.string().trim().min(3, "Enter location"),
  areaSize: z.string().trim().min(1, "Enter area size"),
  image: imageSource,
  notes: z.string().trim().min(6, "Add sale notes"),
});

export type SoldInput = z.infer<typeof soldSchema>;
