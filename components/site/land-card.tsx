import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle, Sparkles } from "lucide-react";
import type { LandRecord } from "@/types";

interface LandCardProps {
  land: LandRecord;
}

export function LandCard({ land }: LandCardProps) {
  return (
    <article className="group overflow-hidden rounded-sm border border-forest-900/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={land.image}
          alt={land.title}
          width={1200}
          height={800}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          {land.featured ? (
            <span className="rounded-full bg-gold-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-forest-950">
              Featured
            </span>
          ) : null}
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
            {land.intent}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-2xl text-forest-950">{land.title}</h3>
            <span className="text-sm font-semibold text-forest-900">{land.price}</span>
          </div>
          <p className="flex items-center gap-2 text-sm text-foreground/65">
            <MapPin className="h-4 w-4 text-gold-500" />
            {land.location}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-y border-forest-900/10 py-4 text-[11px] uppercase tracking-[0.25em] text-foreground/55">
          <div>
            <p>Area</p>
            <p className="mt-1 font-semibold text-foreground">{land.areaSize}</p>
          </div>
          <div>
            <p>Type</p>
            <p className="mt-1 font-semibold text-foreground">{land.landType}</p>
          </div>
          <div>
            <p>Rate</p>
            <p className="mt-1 font-semibold text-foreground">{land.pricePerAcre}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-forest-900">
            <Sparkles className="h-3.5 w-3.5" />
            {land.zoning}
          </span>
          <span className="inline-flex rounded-full border border-forest-900/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground/65">
            {land.coordinates}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/lands/${land.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-forest-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800"
          >
            View details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={`https://wa.me/${land.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Interested in ${land.title}`)}`}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-forest-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-900 transition hover:bg-forest-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
