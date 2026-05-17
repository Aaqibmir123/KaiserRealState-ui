"use client";

import { useState, type FormEvent } from "react";

type ContactInquiryFormState = {
  name: string;
  phone: string;
  email: string;
  landInterest: string;
  message: string;
};

const initialState: ContactInquiryFormState = {
  name: "",
  phone: "",
  email: "",
  landInterest: "",
  message: "",
};

export function ContactInquiryForm() {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleChange = (field: keyof ContactInquiryFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sent");
  };

  return (
    <form className="grid gap-4 rounded-2xl border border-forest-900/10 bg-white p-5 shadow-[0_14px_32px_rgba(0,0,0,0.05)] md:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <p className="text-xs uppercase tracking-[0.35em] text-sand-500">Inquiry form</p>
        <h3 className="font-display text-2xl text-forest-900">Send a direct land inquiry</h3>
        <p className="text-sm leading-6 text-slate-600">
          Share your name, contact details, and the land you want to discuss.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="uppercase tracking-[0.28em] text-[11px] text-slate-500">Name</span>
          <input
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-forest-700 focus:bg-white"
            value={formState.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          <span className="uppercase tracking-[0.28em] text-[11px] text-slate-500">Phone</span>
          <input
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-forest-700 focus:bg-white"
            value={formState.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            placeholder="Phone number"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="uppercase tracking-[0.28em] text-[11px] text-slate-500">Email</span>
          <input
            type="email"
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-forest-700 focus:bg-white"
            value={formState.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="Email address"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          <span className="uppercase tracking-[0.28em] text-[11px] text-slate-500">Land interest</span>
          <input
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-forest-700 focus:bg-white"
            value={formState.landInterest}
            onChange={(event) => handleChange("landInterest", event.target.value)}
            placeholder="Land location or title"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-slate-700">
        <span className="uppercase tracking-[0.28em] text-[11px] text-slate-500">Message</span>
        <textarea
          className="min-h-[120px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-forest-700 focus:bg-white"
          value={formState.message}
          onChange={(event) => handleChange("message", event.target.value)}
          placeholder="Tell us what you need"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-forest-800 px-5 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:bg-forest-700">
          Send inquiry
        </button>
        {status === "sent" ? (
          <span className="text-sm text-forest-700">Inquiry saved locally for now.</span>
        ) : (
          <span className="text-sm text-slate-500">This form is ready for backend wiring.</span>
        )}
      </div>
    </form>
  );
}

export default ContactInquiryForm;
