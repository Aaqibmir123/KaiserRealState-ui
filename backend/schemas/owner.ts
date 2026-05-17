import { z } from "zod";
import { imageSource } from "@/backend/schemas/shared";

export const ownerSchema = z.object({
  name: z.string().trim().min(3, "Enter owner name"),
  role: z.string().trim().min(3, "Enter owner role"),
  experience: z.string().trim().min(3, "Enter experience"),
  bio: z.string().trim().min(20, "Add a longer bio"),
  phone: z.string().trim().min(8, "Enter phone number"),
  whatsapp: z.string().trim().min(8, "Enter WhatsApp number"),
  email: z.string().email("Enter a valid email"),
  officeAddress: z.string().trim().min(3, "Enter office address"),
  photo: imageSource,
  trustBadges: z.array(z.string().trim().min(3, "Add a valid badge")).min(1, "Add at least one badge"),
  socialLinks: z.array(
    z.object({
      label: z.string().trim().min(2, "Enter link label"),
      href: z.string().url("Enter a valid URL"),
    }),
  ),
});

export type OwnerInput = z.infer<typeof ownerSchema>;
