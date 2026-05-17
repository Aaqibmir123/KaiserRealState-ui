import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandCard } from "@/components/site/land-card";
import { SectionHeading } from "@/components/common/section-heading";
import { getLands } from "@/backend/repositories/lands";

export default async function LandsPage() {
  const landRecords = await getLands();

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-5 py-12 md:px-10 md:py-16">
      <SectionHeading
        eyebrow="Land listings"
        title="Curated land assets"
        description="Premium listings kept intentionally land-only for a cleaner investment experience."
        action={
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
          >
            Ask about a site visit
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {landRecords.length ? (
          landRecords.map((land) => <LandCard key={land.id} land={land} />)
        ) : (
          <div className="rounded-sm border border-forest-900/10 bg-white p-6 text-sm text-foreground/65 lg:col-span-3">
            No land listings are live right now. Please contact the owner for current availability.
          </div>
        )}
      </div>
    </div>
  );
}
