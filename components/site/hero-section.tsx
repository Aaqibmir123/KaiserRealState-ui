import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPinned } from "lucide-react";
import { site } from "@/constants/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-forest-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(9,90,67,0.45),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,13,0.88),rgba(4,18,13,0.48))]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-5 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:py-28">
        <div className="order-2 max-w-4xl space-y-6 lg:order-1 lg:space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/20 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-gold-300">
            <BadgeCheck className="h-4 w-4" />
            Premium land only marketplace
          </span>

          <div className="space-y-4">
            <h1 className="max-w-4xl font-serif text-4xl leading-[1.08] sm:text-5xl md:text-7xl">
              Land deals with real trust and clear guidance.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base md:text-lg">
              {site.name} helps buyers and sellers with simple paperwork, direct owner contact,
              and honest land guidance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/lands"
              className="inline-flex items-center gap-2 rounded-sm bg-gold-300 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-950 transition hover:bg-gold-200 sm:px-6 sm:py-4 sm:text-xs"
            >
              Explore lands
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10 sm:px-6 sm:py-4 sm:text-xs"
            >
              Contact owner
              <MapPinned className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-3 sm:pt-6">
            {[
              "10+ years experience",
              "500+ clients served",
              "Direct owner contact",
            ].map((label) => (
              <div key={label} className="rounded-sm border border-white/10 bg-white/5 p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {label}
                </p>
                <p className="mt-2 text-xs leading-6 text-white/68 sm:text-sm sm:leading-7">
                  Simple, premium, and easy to trust.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full border border-gold-300/20 lg:block" />
          <div className="absolute -right-6 bottom-10 hidden h-28 w-28 rounded-full border border-white/10 lg:block" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:p-5 lg:rounded-sm">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-forest-900 sm:rounded-sm">
              <div className="aspect-[1/1] bg-[url('/mir-property-shop.jpg')] bg-cover bg-[center_18%] sm:aspect-[4/5]" />
            </div>
            <div className="mt-3 rounded-sm border border-white/10 bg-white/5 p-3 sm:mt-4 sm:p-4">
              <p className="text-[10px] uppercase tracking-[0.26em] text-gold-300 sm:text-[11px] sm:tracking-[0.35em]">
                Trusted office frontage
              </p>
              <p className="mt-2 text-xs leading-6 text-white/72 sm:text-sm sm:leading-7">
                Real office presence, clean presentation, and direct owner access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
