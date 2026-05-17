"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Mountain, PhoneCall, X } from "lucide-react";
import { ownerProfile, site } from "@/constants/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/lands", label: "Lands" },
  { href: "/sold", label: "Sold" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest-950/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-10 md:py-4">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold-300/20 bg-white/5 text-gold-300 md:h-11 md:w-11">
            <Mountain className="h-4 w-4 md:h-5 md:w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white md:text-sm md:tracking-[0.35em]">
              {site.name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/55 md:text-[11px] md:tracking-[0.3em]">
              Land only, premium only
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.25em] text-white/70 transition hover:text-gold-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${site.phone}`}
          className="hidden items-center gap-2 rounded-sm border border-gold-300/30 px-4 py-2 text-sm uppercase tracking-[0.22em] text-gold-200 transition hover:bg-gold-300 hover:text-forest-950 md:inline-flex"
        >
          <PhoneCall className="h-4 w-4" />
          Call Owner
        </a>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className="hidden border-t border-white/10 bg-black/10 md:block">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-white/60 md:px-10">
          <span>{ownerProfile.name}</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/20 md:inline-flex" />
          <span>{ownerProfile.role}</span>
        </div>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-forest-950 px-5 py-4 lg:hidden">
          <nav className="grid gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.2em] text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
