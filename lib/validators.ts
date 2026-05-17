import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter email or phone"),
  password: z.string().min(6, "Password is required"),
});

export const imageSource = z
  .string()
  .trim()
  .min(1, "Upload an image")
  .refine((value) => /^(https?:\/\/|data:image\/|\/)/.test(value), "Upload a valid image");

export const inquirySchema = z.object({
  customerName: z.string().trim().min(2, "Enter customer name"),
  phone: z.string().trim().min(8, "Enter phone number"),
  email: z.string().email("Enter a valid email"),
  interestedLand: z.string().trim().min(3, "Enter interested land"),
  message: z.string().trim().min(6, "Add a message"),
  inquiryDate: z.string().min(8).optional(),
  contacted: z.boolean().optional(),
});

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

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, "Enter customer name"),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().min(10, "Add a longer review"),
  purchaseLocation: z.string().trim().min(3, "Enter purchase location"),
  purchaseDate: z.string().min(8, "Enter purchase date"),
  photo: imageSource,
  videoPlaceholder: z.string().trim().min(3, "Add a video note"),
});

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

const intentSchema = z.enum(["Buy", "Sell"]);

export const landSchema = z.object({
  title: z.string().trim().min(3, "Enter title"),
  slug: z.string().trim().min(3, "Slug is required"),
  intent: intentSchema,
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

export const landUpdateSchema = landSchema.partial();

export type LoginInput = z.infer<typeof loginSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type SoldInput = z.infer<typeof soldSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type OwnerInput = z.infer<typeof ownerSchema>;
export type LandInput = z.infer<typeof landSchema>;
