"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function AdminModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="mt-6 w-full max-w-5xl rounded-sm border border-forest-900/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-forest-900/10 px-5 py-4 md:px-6">
          <h3 className="mt-2 font-serif text-2xl text-forest-950 md:text-3xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-forest-900/15 text-forest-950 transition hover:bg-forest-50"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-4 py-4 md:px-6 md:py-5">{children}</div>
      </div>
    </div>
  );
}
