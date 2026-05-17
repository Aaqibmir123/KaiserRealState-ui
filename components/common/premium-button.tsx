import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  children: ReactNode;
}

export function PremiumButton({
  variant = "solid",
  className = "",
  children,
  ...props
}: PremiumButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition-all duration-300";
  const styles =
    variant === "solid"
      ? "bg-forest-900 text-white hover:bg-forest-800 shadow-[0_18px_35px_rgba(5,69,50,0.16)]"
      : "border border-forest-900/20 bg-white text-forest-900 hover:border-forest-900 hover:bg-forest-50";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
