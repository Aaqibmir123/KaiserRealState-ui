import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left";

  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      <span className="text-[11px] uppercase tracking-[0.35em] text-gold-300">{eyebrow}</span>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className={alignClass}>
          <h2 className="font-serif text-3xl text-foreground md:text-5xl">{title}</h2>
          {description ? (
            <p className="max-w-3xl text-sm leading-7 text-foreground/70 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}
