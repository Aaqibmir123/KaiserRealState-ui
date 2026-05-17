import { SectionHeading } from "@/components/common/section-heading";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { getTestimonials } from "@/backend/repositories/testimonials";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-5 py-12 md:px-10 md:py-16">
      <SectionHeading
        eyebrow="Testimonials"
        title="Client feedback"
        description="Premium presentation, clear communication, and strong trust signals keep the brand credible."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.length ? (
          testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`testimonial-${testimonial.id ?? "item"}-${testimonial.customerName ?? "guest"}-${testimonial.purchaseDate ?? "date"}-${index}`}
              testimonial={testimonial}
            />
          ))
        ) : (
          <div className="rounded-sm border border-forest-900/10 bg-white p-6 text-sm text-foreground/65 lg:col-span-3">
            Testimonials will appear here once real client feedback is added.
          </div>
        )}
      </div>
    </div>
  );
}
