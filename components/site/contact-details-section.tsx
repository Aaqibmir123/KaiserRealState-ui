import { MapPinned } from "lucide-react";
import { ContactCard } from "@/components/site/contact-card";
import { site } from "@/constants/site";

type ContactDetailsSectionProps = {
  className?: string;
};

export function ContactDetailsSection({ className }: ContactDetailsSectionProps) {
  return (
    <div className={className ? className : "space-y-6"}>
      <ContactCard />

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-sm border border-forest-900/10 bg-forest-950 p-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold-300 sm:text-[11px] sm:tracking-[0.35em]">
            Kupwara location
          </p>
          <div className="mt-4 flex min-h-52 items-center justify-center rounded-sm border border-white/10 bg-white/5">
            <div className="text-center">
              <MapPinned className="mx-auto h-8 w-8 text-gold-300" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/65 sm:tracking-[0.3em]">
                Batergam, Kupwara, Jammu and Kashmir
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">{site.officeAddress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-forest-900/10 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.04)] sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold-300 sm:text-[11px] sm:tracking-[0.35em]">
            Working hours
          </p>
          <h3 className="mt-2 font-serif text-2xl text-forest-950 sm:mt-3 sm:text-3xl">
            Open for inquiries
          </h3>
          <p className="mt-3 text-sm leading-6 text-foreground/70">{site.workingHours}</p>
          <div className="mt-5 rounded-sm border border-forest-900/10 bg-forest-50 p-4">
            <p className="text-sm leading-6 text-foreground/70">
              Office location: Batergam, Kupwara, Jammu and Kashmir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
