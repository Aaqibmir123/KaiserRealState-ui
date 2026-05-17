import Link from "next/link";
import { ArrowLeft, Mail, PhoneCall } from "lucide-react";
import { site } from "@/constants/site";

export default function AdminForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.08),transparent_24%),linear-gradient(180deg,#f9f9f9_0%,#eef4f1_100%)] px-5 py-12">
      <div className="mx-auto max-w-3xl rounded-sm border border-forest-900/10 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Admin recovery</p>
        <h1 className="mt-4 font-serif text-4xl text-forest-950">Forgot password</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/70">
          This admin panel is private. For now, password reset is handled manually by the owner.
          Use the contact details below to recover access.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-forest-900/10 bg-forest-50 p-5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Phone</p>
            <a href={`tel:${site.phone}`} className="mt-3 inline-flex items-center gap-2 text-lg text-forest-950">
              <PhoneCall className="h-4 w-4 text-gold-500" />
              {site.phone}
            </a>
          </div>
          <div className="rounded-sm border border-forest-900/10 bg-forest-50 p-5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Email</p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-flex items-center gap-2 text-lg text-forest-950">
              <Mail className="h-4 w-4 text-gold-500" />
              {site.email}
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-forest-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
