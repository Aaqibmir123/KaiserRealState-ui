import type {
  InquiryRecord,
  LandRecord,
  OwnerProfile,
  SoldRecord,
  TestimonialRecord,
} from "@/types";

export const site = {
  name: "Qaiser Land Estates",
  ownerName: "Qaiser Ahmad Mir",
  ownerRole: "Land Dealer / Property Consultant",
  tagline: "Trusted land buying, selling, and advisory.",
  phone: "+91 7889893844",
  whatsapp: "+917889893844",
  email: "qaiserrealstate221@gmail.com",
  officeAddress: "Batergam, Kupwara, Jammu and Kashmir",
  workingHours: "Mon - Sat, 10:00 AM - 7:00 PM",
  whatsappMessage: "Hello Qaiser Ahmad Mir, I want to inquire about your land listings.",
};

export const ownerProfile: OwnerProfile = {
  name: "Qaiser Ahmad Mir",
  role: "Land Dealer / Property Consultant",
  experience: "10+ years in land deals and property advisory",
  bio:
    "Qaiser Ahmad Mir helps land buyers and sellers with clear titles, honest pricing, and direct owner support. The work is built on trust, market knowledge, and careful due diligence.",
  phone: site.phone,
  whatsapp: site.whatsapp,
  email: site.email,
  officeAddress: site.officeAddress,
  trustBadges: [
    "Verified land documentation",
    "Title and zoning due diligence",
    "Buyer-first negotiation support",
    "Fast response on WhatsApp",
  ],
  socialLinks: [
    { label: "WhatsApp", href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` },
    { label: "Call", href: `tel:${site.phone}` },
    { label: "Email", href: `mailto:${site.email}` },
  ],
  photo: "/owner-kaiser.jpg",
};

export const credibilityStats = [
  { label: "Years of experience", value: "10+" },
  { label: "Clients served", value: "500+" },
  { label: "Land deals handled", value: "100+" },
  { label: "Direct response", value: "Fast" },
];

export const landRecords: LandRecord[] = [];

export const soldRecords: SoldRecord[] = [];

export const testimonials: TestimonialRecord[] = [];

export const inquiries: InquiryRecord[] = [];
