"use client";

import Link from "next/link";
import {
  Banknote,
  ChevronRight,
  Inbox,
  LandPlot,
  PencilLine,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  useGetInquiriesQuery,
  useGetLandsQuery,
  useGetSoldRecordsQuery,
  useGetSummaryQuery,
  useGetTestimonialsQuery,
} from "@/frontend/store/api/kasierApi";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof LandPlot;
  accent: string;
}) {
  return (
    <div className={`overflow-hidden rounded-sm border border-white/15 p-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] ${accent}`}>
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-5 w-5 text-white/85" />
        <ChevronRight className="h-4 w-4 text-white/50" />
      </div>
      <p className="mt-5 font-serif text-4xl">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/75">{label}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-sm border border-forest-900/10 bg-white/95 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="mt-2 font-serif text-2xl text-forest-950">{title}</h3>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function AdminOverview() {
  const { data: summary } = useGetSummaryQuery();
  const { data: lands = [] } = useGetLandsQuery();
  const { data: sold = [] } = useGetSoldRecordsQuery();
  const { data: testimonials = [] } = useGetTestimonialsQuery();
  const { data: inquiries = [] } = useGetInquiriesQuery();

  const activeInquiries = inquiries.filter((item) => !item.contacted).length;
  const latestLands = lands.slice(0, 3);
  const latestSold = sold.slice(0, 3);
  const latestTestimonials = testimonials.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-sm border border-forest-900/10 bg-forest-950 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:grid-cols-[1.2fr_0.8fr] md:p-6">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Private admin</p>
          <h1 className="font-serif text-2xl leading-tight md:text-4xl">Qaiser Panel</h1>
          <p className="max-w-2xl text-sm leading-6 text-white/72 md:leading-7">
            Live control center for lands, sold history, inquiries, testimonials, and the owner profile.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">Today</p>
            <p className="mt-2 font-serif text-2xl md:text-3xl">{activeInquiries}</p>
            <p className="mt-1 text-sm text-white/70">Open inquiries</p>
          </div>
          <div className="rounded-sm border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">Status</p>
            <p className="mt-2 font-serif text-2xl md:text-3xl">
              {summary?.activeListings ?? lands.filter((item) => !item.sold).length}
            </p>
            <p className="mt-1 text-sm text-white/70">Active lands</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total lands" value={summary?.totalLands ?? lands.length} icon={LandPlot} accent="bg-gradient-to-br from-emerald-600 via-emerald-700 to-forest-950" />
        <StatCard label="Sold lands" value={summary?.soldLands ?? sold.length} icon={Banknote} accent="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700" />
        <StatCard label="New inquiries" value={summary?.newInquiries ?? activeInquiries} icon={Inbox} accent="bg-gradient-to-br from-sky-600 via-cyan-700 to-forest-900" />
        <StatCard label="Testimonials" value={summary?.testimonials ?? testimonials.length} icon={Star} accent="bg-gradient-to-br from-violet-600 via-fuchsia-700 to-rose-700" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Quick actions">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/admin/lands", label: "Manage lands", icon: LandPlot, color: "from-emerald-600 to-forest-950" },
              { href: "/admin/sold", label: "Sold records", icon: Banknote, color: "from-orange-500 to-amber-700" },
              { href: "/admin/inquiries", label: "Inquiries", icon: Inbox, color: "from-sky-600 to-cyan-700" },
              { href: "/admin/testimonials", label: "Testimonials", icon: Star, color: "from-violet-600 to-fuchsia-700" },
              { href: "/admin/owner", label: "Owner profile", icon: PencilLine, color: "from-violet-600 to-fuchsia-700" },
            ].map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className={`group flex items-center justify-between rounded-sm bg-gradient-to-br ${color} px-4 py-4 text-white transition hover:-translate-y-0.5`}
              >
                <span className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em]">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <ChevronRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Recent proof">
          <div className="space-y-3">
            {latestTestimonials.map((item) => (
              <div
                key={item.id}
                className="rounded-sm border border-forest-900/10 bg-gradient-to-r from-forest-50 to-white p-4"
              >
                <p className="font-semibold text-forest-950">{item.customerName}</p>
                <p className="mt-1 text-sm text-foreground/65">{item.purchaseLocation}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel title="Recent lands">
          <div className="space-y-3">
            {latestLands.map((item) => (
              <div key={item.id} className="rounded-sm border border-forest-900/10 bg-gradient-to-r from-forest-50 to-white p-4">
                <p className="font-semibold text-forest-950">{item.title}</p>
                <p className="mt-1 text-sm text-foreground/65">
                  {item.location} - {item.price}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent sold">
          <div className="space-y-3">
            {latestSold.map((item) => (
              <div key={item.id} className="rounded-sm border border-forest-900/10 bg-gradient-to-r from-amber-50 to-white p-4">
                <p className="font-semibold text-forest-950">{item.buyerName}</p>
                <p className="mt-1 text-sm text-foreground/65">
                  {item.location} - {item.salePrice}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
