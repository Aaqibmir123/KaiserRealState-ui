"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { AdminModal } from "@/frontend/components/admin/admin-modal";

export function ConfirmActionModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  confirmTone = "danger",
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  confirmTone?: "danger" | "neutral";
}) {
  return (
    <AdminModal open={open} title={title} onClose={onClose}>
      <div className="grid gap-5">
        <div className="flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm leading-7">{message}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void onConfirm()}
            className={`inline-flex items-center gap-2 rounded-sm px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] ${
              confirmTone === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-forest-950 text-white hover:bg-forest-800"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950"
          >
            Cancel
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
