import { BadgeCheck, Mail, MessageCircle, PhoneCall, ShieldCheck, Star } from "lucide-react";
import { ownerProfile } from "@/constants/site";
import { SectionHeading } from "@/components/common/section-heading";

export function OwnerHighlight() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
      <SectionHeading
        eyebrow="Owner profile"
        title="A trusted face behind every land deal"
        description="Land-only service, clear titles, honest pricing, and direct owner support. Built for buyers who want simple, trusted guidance."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-sm border border-forest-900/10 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">
            Owner-led advisory
          </p>
          <h3 className="mt-3 font-serif text-3xl text-forest-950">{ownerProfile.name}</h3>
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-foreground/55">
            {ownerProfile.role}
          </p>
          <p className="mt-5 text-sm leading-7 text-foreground/70">{ownerProfile.experience}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {ownerProfile.trustBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-sm border border-forest-900/10 bg-forest-50 p-4 text-sm text-foreground/75"
              >
                <BadgeCheck className="mb-2 h-5 w-5 text-gold-500" />
                {badge}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-sm border border-forest-900/10 bg-forest-950 p-8 text-white">
          <div className="flex items-center gap-3 text-gold-300">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-[11px] uppercase tracking-[0.35em]">Why clients trust us</span>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/75">{ownerProfile.bio}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {ownerProfile.trustBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm text-white/80"
              >
                <BadgeCheck className="mb-2 h-5 w-5 text-gold-300" />
                {badge}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${ownerProfile.phone}`}
              className="inline-flex items-center gap-2 rounded-sm bg-gold-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-gold-200"
            >
              <PhoneCall className="h-4 w-4" />
              Call
            </a>
            <a
              href={`https://wa.me/${ownerProfile.whatsapp.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={`mailto:${ownerProfile.email}`}
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/45">
            <Star className="h-4 w-4 text-gold-300" />
            Land-only advisory, no apartment or bedroom listings.
          </div>
        </div>
      </div>
    </section>
  );
}
