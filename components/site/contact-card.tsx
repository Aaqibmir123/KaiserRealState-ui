import { Mail, MapPin, PhoneCall, TimerReset, MessageSquare } from "lucide-react";
import { site } from "@/constants/site";

export function ContactCard() {
  return (
    <div className="w-full rounded-sm border border-forest-900/10 bg-forest-950 p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] sm:p-8 md:p-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold-300 sm:text-[11px] sm:tracking-[0.35em]">Contact owner</p>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl">{site.ownerName}</h3>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/55 sm:text-sm sm:tracking-[0.25em]">{site.ownerRole}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:leading-7">
            Direct owner contact for land buying and selling.
          </p>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
            <p className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <PhoneCall className="h-4 w-4 text-gold-300" />
              {site.phone}
            </p>
            <p className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <Mail className="h-4 w-4 text-gold-300" />
              {site.email}
            </p>
            <p className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <MapPin className="h-4 w-4 text-gold-300" />
              {site.officeAddress}
            </p>
            <p className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <TimerReset className="h-4 w-4 text-gold-300" />
              {site.workingHours}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold-300 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-200 sm:px-5 sm:py-4 sm:text-xs"
            >
              <PhoneCall className="h-4 w-4" />
              Call now
            </a>
            <a
              href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                site.whatsappMessage,
              )}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10 sm:px-5 sm:py-4 sm:text-xs"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp inquiry
            </a>
          </div>
        </div>

        <div className="rounded-sm border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold-300 sm:text-[11px] sm:tracking-[0.35em]">
            What clients get
          </p>
          <h4 className="mt-2 font-serif text-2xl text-white sm:mt-3 sm:text-3xl">
            No middle layer
          </h4>
          <p className="mt-3 text-sm leading-6 text-white/72 sm:leading-7">
            Simple contact, fast reply, clear land deals.
          </p>
          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
            {[
              "Owner-led response",
              "Fast WhatsApp follow-up",
              "Land-only business",
              "Clear communication",
            ].map((item) => (
              <div key={item} className="rounded-sm border border-white/10 bg-white/5 p-4 text-sm text-white/78">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
