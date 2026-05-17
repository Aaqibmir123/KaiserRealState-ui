export type Intent = "Buy" | "Sell";

export type LandType = string;

export interface OwnerProfile {
  name: string;
  role: string;
  experience: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress: string;
  trustBadges: string[];
  socialLinks: Array<{ label: string; href: string }>;
  photo: string;
}

export interface LandRecord {
  id: string;
  slug: string;
  title: string;
  intent: Intent;
  price: string;
  purchasePrice?: string;
  location: string;
  areaSize: string;
  landType: LandType;
  zoning: string;
  featured: boolean;
  sold: boolean;
  description: string;
  investmentPotential: string[];
  nearbyLandmarks: string[];
  coordinates: string;
  image: string;
  gallery: string[];
  sourceBuyId?: string;
  purchasedFromName: string;
  purchasedFromPhone: string;
  purchaseDate: string;
  aadhaarCardImage: string;
  geoTagImage: string;
  soldToName?: string;
  soldToPhone?: string;
  soldToLocation?: string;
  soldToAadhaarImage?: string;
  soldToGeoTagImage?: string;
  sellDate?: string;
  contactPhone: string;
  whatsapp: string;
  pricePerAcre: string;
}

export interface SoldRecord {
  id: string;
  buyerName: string;
  saleDate: string;
  salePrice: string;
  contactPhone: string;
  location: string;
  areaSize: string;
  image: string;
  notes: string;
}

export interface TestimonialRecord {
  id: string;
  customerName: string;
  rating: number;
  feedback: string;
  purchaseLocation: string;
  purchaseDate: string;
  photo: string;
  videoPlaceholder: string;
}

export interface InquiryRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  interestedLand: string;
  message: string;
  inquiryDate: string;
  contacted: boolean;
}

export interface AdminAuthUser {
  id: string;
  email: string;
  name: string;
}

export interface DashboardSummary {
  totalLands: number;
  activeListings: number;
  soldLands: number;
  newInquiries: number;
  testimonials: number;
}
