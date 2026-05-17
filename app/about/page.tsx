import { BadgeCheck, Building2 } from "lucide-react";
import { OwnerHighlight } from "@/components/site/owner-highlight";
import { SectionHeading } from "@/components/common/section-heading";

const values = [
  "Land-only specialization",
  "Direct owner-led advisory",
  "Clear title and documentation focus",
  "Premium corridor curation",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-20 px-5 py-12 md:px-10 md:py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-sm border border-forest-900/10 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <SectionHeading
            eyebrow="About"
            title="Built around trust, not clutter"
            description="The business is designed as a premium land advisory brand. Everything from the typography to the photo crop is meant to feel real, calm, and investment-led."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value} className="rounded-sm border border-forest-900/10 bg-forest-50 p-4">
                <BadgeCheck className="h-5 w-5 text-gold-500" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-forest-950">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-forest-900/10 bg-forest-950 p-8 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Brand position</p>
          <h2 className="mt-3 font-serif text-3xl">Professional, land-only, and owner-led</h2>
          <p className="mt-3 text-sm leading-7 text-white/75">
            This section keeps the about page clean without repeating the owner or shop photos.
            It explains the brand character in a way that matches the editorial style of the
            design kit.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "No residential clutter",
              "No public admin exposure",
              "Clear land-first messaging",
              "High trust visual language",
            ].map((item) => (
              <div key={item} className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <OwnerHighlight />

      <section className="grid gap-6 md:grid-cols-3">
        {[
          ["Market expertise", "Focused on land valuation, zoning context, and corridor growth."],
          ["Transparent process", "Every inquiry begins with direct communication and clear records."],
          ["Investment lens", "Listings are positioned like assets, not generic property cards."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-sm border border-forest-900/10 bg-white p-6">
            <Building2 className="h-5 w-5 text-gold-500" />
            <h3 className="mt-4 font-serif text-2xl text-forest-950">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-foreground/70">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
