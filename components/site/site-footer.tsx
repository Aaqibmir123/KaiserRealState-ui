import Link from "next/link";
import { Mail, MapPin, PhoneCall, Send } from "lucide-react";
import { site } from "@/constants/site";

const quickLinks = [
  { href: "/lands", label: "Land Listings" },
  { href: "/sold", label: "Sold History" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About Qaiser" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-forest-900/10 bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-forest-900">
            {site.name}
          </p>
          <p className="max-w-sm text-sm leading-7 text-foreground/70">
            Exclusive land buying and selling advisory with a quiet luxury brand language and
            practical deal execution.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-foreground/60">Quick Links</p>
          <div className="flex flex-col gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/70 transition hover:text-forest-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-foreground/60">Contact</p>
          <div className="space-y-3 text-sm text-foreground/70">
            <p className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-gold-500" />
              {site.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-500" />
              {site.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-500" />
              {site.officeAddress}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-foreground/60">WhatsApp</p>
          <a
            href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
              site.whatsappMessage,
            )}`}
            className="flex items-center gap-2 text-sm text-foreground/70 transition hover:text-forest-900"
          >
            <Send className="h-4 w-4 text-gold-500" />
            Start a private inquiry
          </a>
        </div>
      </div>
      <div className="border-t border-forest-900/10 px-5 py-5 text-center text-xs uppercase tracking-[0.25em] text-foreground/45 md:px-10">
        Copyright {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
