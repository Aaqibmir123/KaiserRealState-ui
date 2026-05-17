import { z } from "zod";
import { imageSource } from "@/backend/schemas/shared";

export const landBaseSchema = z.object({
  title: z.string().trim().min(3, "Enter title"),
  slug: z.string().trim().min(3, "Slug is required"),
  intent: z.enum(["Buy", "Sell"]),
  price: z.string().trim().min(1, "Enter price"),
  purchasePrice: z.string().trim().optional(),
  location: z.string().trim().min(3, "Enter location"),
  areaSize: z.string().trim().min(1, "Enter area size"),
  landType: z.string().trim().default("Land"),
  zoning: z.string().trim().default("General land use"),
  featured: z.boolean().default(false),
  sold: z.boolean().default(false),
  description: z.string().trim().min(20, "Add land details"),
  investmentPotential: z.array(z.string().trim().min(3, "Add a valid note")).min(1, "Add at least one note"),
  nearbyLandmarks: z.array(z.string().trim().min(2, "Add a valid landmark")).min(1, "Add at least one landmark"),
  coordinates: z.string().trim().min(3, "Enter coordinates"),
  image: imageSource,
  gallery: z.array(imageSource).min(1, "Upload at least one image"),
  sourceBuyId: z.string().trim().optional(),
  purchasedFromName: z.string().trim().min(2, "Enter the seller name"),
  purchasedFromPhone: z.string().trim().min(8, "Enter the seller phone"),
  purchaseDate: z.string().trim().min(8, "Enter the purchase date"),
  aadhaarCardImage: imageSource,
  geoTagImage: imageSource,
  soldToName: z.string().trim().optional(),
  soldToPhone: z.string().trim().optional(),
  soldToLocation: z.string().trim().optional(),
  soldToAadhaarImage: imageSource.optional(),
  soldToGeoTagImage: imageSource.optional(),
  sellDate: z.string().trim().optional(),
  dealClosed: z.boolean().optional(),
  contactPhone: z.string().trim().min(8, "Enter contact phone"),
  whatsapp: z.string().trim().min(8, "Enter WhatsApp number"),
  pricePerAcre: z.string().trim().min(1, "Enter price per acre"),
});

export const landSchema = landBaseSchema.superRefine((data, ctx) => {
  if (data.intent === "Sell") {
    if (!data.sourceBuyId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceBuyId"], message: "Select a purchased property" });
    if (!data.purchasePrice) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["purchasePrice"], message: "Purchase price is required" });
    if (!data.soldToName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["soldToName"], message: "Enter buyer name" });
    if (!data.soldToPhone) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["soldToPhone"], message: "Enter buyer phone" });
    if (!data.soldToLocation) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["soldToLocation"], message: "Enter buyer location" });
    if (!data.soldToAadhaarImage) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["soldToAadhaarImage"], message: "Upload buyer Aadhaar image" });
    if (!data.soldToGeoTagImage) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["soldToGeoTagImage"], message: "Upload sale geo tag image" });
    if (!data.sellDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sellDate"], message: "Enter sell date" });
  }
});

export const landUpdateSchema = landBaseSchema.partial();

export type LandInput = z.infer<typeof landSchema>;
