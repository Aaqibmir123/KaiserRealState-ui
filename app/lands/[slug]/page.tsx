import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPinned, MessageCircle, PhoneCall } from "lucide-react";
import { LandCard } from "@/components/site/land-card";
import { SectionHeading } from "@/components/common/section-heading";
import { getLandBySlug, getLands } from "@/backend/repositories/lands";

interface LandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const landRecords = await getLands();
  return landRecords.map((land) => ({ slug: land.slug }));
}

export default async function LandDetailPage({ params }: LandDetailPageProps) {
  const { slug } = await params;
  const land = await getLandBySlug(slug);

  if (!land) {
    notFound();
  }

  const landRecords = await getLands();
  const gallery = land.gallery.length > 0 ? land.gallery : [land.image];
  const similarLands = landRecords.filter((item) => item.id !== land.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1440px] space-y-12 px-5 py-12 md:px-10 md:py-16">
      <SectionHeading
        eyebrow="Land detail"
        title={land.title}
        description={land.description}
        action={
          <Link
            href="/lands"
            className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <Image
              src={land.image}
              alt={land.title}
              width={1600}
              height={1100}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.slice(0, 2).map((photo) => (
              <div
                key={photo}
                className="overflow-hidden rounded-sm border border-forest-900/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <Image
                  src={photo}
                  alt={land.title}
                  width={1200}
                  height={800}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5 rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Price</p>
            <h2 className="mt-2 font-serif text-4xl text-forest-950">{land.price}</h2>
          </div>
          <div className="space-y-3 text-sm text-foreground/70">
            <p>
              <span className="text-foreground/45">Location:</span> {land.location}
            </p>
            <p>
              <span className="text-foreground/45">Area:</span> {land.areaSize}
            </p>
            <p>
              <span className="text-foreground/45">Land type:</span> {land.landType}
            </p>
            <p>
              <span className="text-foreground/45">Zoning:</span> {land.zoning}
            </p>
          </div>
          <div className="grid gap-3">
            <a
              href={`tel:${land.contactPhone}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-forest-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800"
            >
              <PhoneCall className="h-4 w-4" />
              Call owner
            </a>
            <a
              href={`https://wa.me/${land.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                `I want to enquire about ${land.title}`,
              )}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp inquiry
            </a>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <h3 className="font-serif text-3xl text-forest-950">Investment potential</h3>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/70">
            {land.investmentPotential.map((item) => (
              <li key={item} className="rounded-sm border border-forest-900/10 bg-forest-50 p-4">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-sm border border-forest-900/10 bg-forest-950 p-6 text-white">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Nearby landmarks</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {land.nearbyLandmarks.map((item) => (
              <div key={item} className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm">
                <MapPinned className="mb-3 h-5 w-5 text-gold-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading eyebrow="Similar lands" title="More premium parcels" />
        <div className="grid gap-6 lg:grid-cols-3">
          {similarLands.map((item) => (
            <LandCard key={item.id} land={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
