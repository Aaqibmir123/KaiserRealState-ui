import Image from "next/image";
import { CalendarDays, Landmark } from "lucide-react";
import type { SoldRecord } from "@/types";

interface SoldTimelineProps {
  soldRecords: SoldRecord[];
}

export function SoldTimeline({ soldRecords }: SoldTimelineProps) {
  return (
    <div className="relative space-y-6">
      <div className="absolute left-6 top-0 h-full w-px bg-forest-900/10" />
      {soldRecords.map((record, index) => (
        <div key={record.id} className="relative pl-16">
          <div className="absolute left-[18px] top-6 h-5 w-5 rounded-full border-4 border-white bg-gold-300 shadow-sm" />
          <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] md:grid md:grid-cols-[260px_1fr]">
            <div className="relative min-h-[240px]">
              <Image src={record.image} alt={record.location} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-foreground/50">
                <span className="inline-flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-gold-500" />
                  Sale #{index + 1}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold-500" />
                  {record.saleDate}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-3xl text-forest-950">{record.location}</h3>
              <div className="mt-4 grid gap-4 text-sm text-foreground/70 md:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">Buyer</p>
                  <p className="mt-1 font-semibold text-foreground">{record.buyerName}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">Area</p>
                  <p className="mt-1 font-semibold text-foreground">{record.areaSize}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">Price</p>
                  <p className="mt-1 font-semibold text-foreground">{record.salePrice}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground/65">{record.notes}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
