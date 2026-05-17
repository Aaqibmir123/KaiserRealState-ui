import { Filter } from "lucide-react";

export function LandFilterBar() {
  return (
    <div className="rounded-sm border border-forest-900/10 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Intent", "Buy"],
          ["Location", "Srinagar"],
          ["Price Range", "₹2 Cr - ₹10 Cr"],
          ["Area Size", "0.5 Acre - 5 Acre"],
          ["Land Type", "Agricultural"],
        ].map(([label, value]) => (
          <label key={label} className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">{label}</span>
            <input
              defaultValue={value}
              className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-forest-900"
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-sm bg-gold-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950 transition hover:bg-gold-200">
          <Filter className="h-4 w-4" />
          Apply filters
        </button>
      </div>
    </div>
  );
}
