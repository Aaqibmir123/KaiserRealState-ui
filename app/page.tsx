import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  LandPlot,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ContactDetailsSection } from "@/components/site/contact-details-section";
import { HeroSection } from "@/components/site/hero-section";
import { LandCard } from "@/components/site/land-card";
import { OwnerHighlight } from "@/components/site/owner-highlight";
import { SectionHeading } from "@/components/common/section-heading";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { credibilityStats, site } from "@/constants/site";
import { getLands } from "@/backend/repositories/lands";
import { getTestimonials } from "@/backend/repositories/testimonials";

export default async function Home() {
  const [landRecords, testimonials] = await Promise.all([
    getLands(),
    getTestimonials(),
  ]);

  const stats = [
    { label: credibilityStats[0].label, value: credibilityStats[0].value, icon: ShieldCheck },
    { label: credibilityStats[1].label, value: credibilityStats[1].value, icon: LandPlot },
    { label: credibilityStats[2].label, value: credibilityStats[2].value, icon: Banknote },
    { label: credibilityStats[3].label, value: credibilityStats[3].value, icon: Sparkles },
  ];

  return (
    <div className="space-y-8 pb-16">
      <HeroSection />

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] md:p-8">
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
              Kashmir showcase
            </span>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-forest-950 md:text-5xl">
              Land stories that feel premium and easy to trust.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground/70 md:text-base">
              Buyers want simple answers. This section shows the brand clearly, with a real office
              image, strong local presence, and a direct path to the owner.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Local Kupwara office",
                "Direct owner guidance",
                "Simple land presentation",
                "Clean, premium communication",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-sm border border-forest-900/10 bg-forest-50 p-4 text-sm text-foreground/75"
                >
                  <BadgeCheck className="mb-2 h-5 w-5 text-gold-500" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
              >
                Contact owner
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-forest-950 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <div className="grid h-full md:grid-rows-[1fr_auto]">
              <div className="relative min-h-[280px] md:min-h-[420px]">
                <Image
                  src="https://images.pexels.com/photos/5502228/pexels-photo-5502228.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Modern house in Kashmir landscape"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={false}
                />
              </div>
              <div className="border-t border-white/10 p-6 md:p-7">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
                  Fresh house visual
                </p>
                <h3 className="mt-2 font-serif text-3xl">Brand new from Kashmir</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  A clean, premium home view that makes the homepage feel fresh, modern, and more
                  attractive to new buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] md:p-8">
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
              Legacy brand overview
            </span>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-forest-950 md:text-5xl">
              Clear land deals, trusted guidance, and direct owner support.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground/70 md:text-base">
              This website stays land-only and easy to understand. Buyers get honest guidance,
              simple communication, and a direct line to the owner.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-sm border border-forest-900/10 bg-forest-50 p-4"
                >
                  <Icon className="h-5 w-5 text-gold-500" />
                  <p className="mt-4 font-serif text-3xl text-forest-950">{value}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-foreground/55">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-sm border border-forest-900/10 bg-forest-950 p-8 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Office presence</p>
              <h3 className="mt-3 font-serif text-3xl">Branded frontage, shown once</h3>
              <p className="mt-3 text-sm leading-7 text-white/72">
                The shop image is kept to one hero placement only, so the page feels deliberate
                instead of repetitive.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Real office identity",
                  "Tight crop control",
                  "No repeated shop imagery",
                  "Premium visual hierarchy",
                ].map((item) => (
                  <div key={item} className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-forest-950 p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] md:p-8">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
                  Owner focus
                </p>
                <h3 className="font-serif text-3xl">{site.ownerName}</h3>
                <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                  {site.ownerRole}
                </p>
                <p className="text-sm leading-7 text-white/72">
                  Premium land deals, clean paperwork, and direct communication through a trusted
                  owner-led process.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Land only", "Verified title", "Buyer-first", "Fast WhatsApp"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] md:p-8">
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
              Kashmir land spotlight
            </span>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-forest-950 md:text-5xl">
              Premium land opportunities from Kashmir.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground/70 md:text-base">
              Every listing is shown with a simple, honest style. Buyers can understand the land,
              see the value, and contact the owner without confusion.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Clear title guidance",
                "Simple pricing discussion",
                "Direct owner response",
                "Trusted Kupwara office",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-sm border border-forest-900/10 bg-forest-50 p-4 text-sm text-foreground/75"
                >
                  <BadgeCheck className="mb-2 h-5 w-5 text-gold-500" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/lands"
                className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800"
              >
                View lands
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
              >
                Contact owner
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-forest-950 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <div className="grid h-full gap-0 md:grid-cols-[0.9fr_1.1fr]">
              <div className="p-6 md:p-8">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
                  Land brand story
                </p>
                <h3 className="mt-3 font-serif text-3xl">Simple, premium, and clear.</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  New buyers want fast understanding. This section gives them a clean brand story,
                  a real office image, and a direct way to move forward.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    10+ years of trusted land experience
                  </div>
                  <div className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    500+ clients served with direct support
                  </div>
                </div>
              </div>
              <div className="min-h-[280px] bg-[url('/owner-kaiser.jpg')] bg-cover bg-[center_15%] md:min-h-full" />
            </div>
          </div>
        </div>
      </section>

      <OwnerHighlight />

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Contact"
          title="Reach the owner directly"
          description="Direct communication stays simple and credible, with the contact card shown prominently on the homepage."
        />
        <div className="mt-4">
          <ContactDetailsSection />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Featured lands"
          title="Premium listings presented like an investment portfolio"
          description="A land-first layout keeps the commercial focus sharp while making each asset feel curated, not crowded."
          action={
            <Link
              href="/lands"
              className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
            >
              View all lands
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {landRecords.length ? (
            landRecords.slice(0, 3).map((land) => <LandCard key={land.id} land={land} />)
          ) : (
            <div className="rounded-sm border border-forest-900/10 bg-white p-6 text-sm text-foreground/65 lg:col-span-3">
              No land listings have been added yet. New inventory will appear here once published.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-sm border border-forest-900/10 bg-forest-950 p-8 text-white">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
              Why clients choose us
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              We make land deals feel calm, premium, and clear.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Transparent title review",
                "WhatsApp-first communication",
                "High-value corridor curation",
                "Land-only positioning",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm text-white/80"
                >
                  <BadgeCheck className="mb-3 h-5 w-5 text-gold-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-forest-900/10 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Investment note</p>
            <h3 className="mt-3 font-serif text-3xl text-forest-950">
              Buy, sell, or hold land with a long-term view.
            </h3>
            <p className="mt-4 text-sm leading-7 text-foreground/70">
              The site language is intentionally editorial and minimal, matching the design system
              patterns from the kit: dark forest green, thin borders, gold highlights, and open
              white space.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800"
              >
                <MapPinned className="h-4 w-4" />
                Contact owner
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  site.whatsappMessage,
                )}`}
                className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
              >
                WhatsApp inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Testimonials"
          title="The tone stays premium even in customer feedback"
          description="Serif quote styling and simple cards keep the social proof aligned with the overall editorial brand."
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {testimonials.length ? (
            testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-${testimonial.id ?? "item"}-${testimonial.customerName ?? "guest"}-${testimonial.purchaseDate ?? "date"}-${index}`}
                testimonial={testimonial}
              />
            ))
          ) : (
            <div className="rounded-sm border border-forest-900/10 bg-white p-6 text-sm text-foreground/65 lg:col-span-3">
              Client testimonials will appear here once real feedback is added.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
