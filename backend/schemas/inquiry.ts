import { z } from "zod";

export const inquirySchema = z.object({
  customerName: z.string().trim().min(2, "Enter customer name"),
  phone: z.string().trim().min(8, "Enter phone number"),
  email: z.string().email("Enter a valid email"),
  interestedLand: z.string().trim().min(3, "Enter interested land"),
  message: z.string().trim().min(6, "Add a message"),
  inquiryDate: z.string().min(8).optional(),
  contacted: z.boolean().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
