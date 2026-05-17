import { getInquiries } from "@/lib/repositories/inquiries";
import { getLands } from "@/lib/repositories/lands";
import { getSoldRecords } from "@/lib/repositories/sold";
import { getTestimonials } from "@/lib/repositories/testimonials";
import type { DashboardSummary } from "@/types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [lands, sold, inquiries, testimonials] = await Promise.all([
    getLands(),
    getSoldRecords(),
    getInquiries(),
    getTestimonials(),
  ]);

  return {
    totalLands: lands.length,
    activeListings: lands.filter((item) => !item.sold).length,
    soldLands: sold.length,
    newInquiries: inquiries.filter((item) => !item.contacted).length,
    testimonials: testimonials.length,
  };
}
