import Image from "next/image";
import { Quote, Star } from "lucide-react";
import type { TestimonialRecord } from "@/types";

interface TestimonialCardProps {
  testimonial: TestimonialRecord;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-4">
        <Image
          src={testimonial.photo}
          alt={testimonial.customerName}
          width={120}
          height={120}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-1 text-gold-500">
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <Quote className="mb-3 h-5 w-5 text-gold-500" />
          <p className="font-serif text-xl leading-8 text-forest-950">{testimonial.feedback}</p>
          <div className="mt-4 h-px w-16 bg-gold-300" />
          <div className="mt-4 space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest-900">
              {testimonial.customerName}
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">
              {testimonial.purchaseLocation} • {testimonial.purchaseDate}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
