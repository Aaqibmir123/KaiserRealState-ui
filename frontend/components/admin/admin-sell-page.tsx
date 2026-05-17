"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { site } from "@/constants/site";
import {
  useCreateLandMutation,
  useDeleteLandMutation,
  useGetLandsQuery,
  useUpdateLandMutation,
} from "@/frontend/store/api/kasierApi";
import { AdminModal } from "@/frontend/components/admin/admin-modal";
import { ConfirmActionModal } from "@/frontend/components/admin/confirm-action-modal";
import { SingleImageInput } from "@/frontend/components/admin/media-inputs";
import type { LandRecord } from "@/types";

type Feedback = { kind: "success" | "error"; text: string } | null;

type SellDraft = {
  slug: string;
  sourceBuyId: string;
  soldToName: string;
  soldToPhone: string;
  soldToLocation: string;
  soldToAadhaarImage: string;
  soldToGeoTagImage: string;
  sellDate: string;
  sellPrice: string;
  dealClosed: boolean;
};

const emptyDraft = (sourceBuyId = ""): SellDraft => ({
  slug: "",
  sourceBuyId,
  soldToName: "",
  soldToPhone: "",
  soldToLocation: "",
  soldToAadhaarImage: "",
  soldToGeoTagImage: "",
  sellDate: new Date().toISOString().slice(0, 10),
  sellPrice: "",
  dealClosed: true,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function parseMoney(value: string | number | undefined | null) {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const normalized = value.toLowerCase().replace(/,/g, "").trim();
  const match = normalized.match(/(\d+(\.\d+)?)/);
  if (!match) return 0;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return 0;

  if (/\bcrore\b|\bcr\b/.test(normalized)) return base * 10000000;
  if (/\blakh\b|\blac\b|\blk\b/.test(normalized)) return base * 100000;
  if (/\bthousand\b|\bk\b/.test(normalized)) return base * 1000;
  return base;
}

function readErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;
  const response = error as { data?: { error?: string } };
  return response.data?.error ?? fallback;
}

function MessageBanner({
  feedback,
  onDismiss,
}: {
  feedback: Feedback;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  return (
    <div
      className={`rounded-sm border px-4 py-3 text-sm ${
        feedback.kind === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      aria-live="polite"
    >
      {feedback.text}
    </div>
  );
}

function ImageTile({
  label,
  src,
}: {
  label: string;
  src?: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-forest-50">
      <div className="border-b border-forest-900/10 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-forest-700">
        {label}
      </div>
      <div className="relative pt-[62%]">
        {src ? (
          <Image src={src} alt={label} fill unoptimized className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-foreground/45">Missing</div>
        )}
      </div>
    </div>
  );
}

function SellRecordCard({
  item,
  source,
  onEdit,
  onDelete,
}: {
  item: LandRecord;
  source?: LandRecord | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const purchasePrice = parseMoney(item.purchasePrice ?? source?.price ?? 0);
  const sellPrice = parseMoney(item.price ?? 0);
  const profit = sellPrice - purchasePrice;

  return (
    <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-white">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-52 bg-forest-100">
          {item.image ? <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" /> : null}
          <div className="absolute left-3 top-3 rounded-full bg-forest-950/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white">
            Sell
          </div>
        </div>

        <div className="p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div>
                <p className="font-serif text-2xl text-forest-950">{item.title}</p>
                <p className="mt-1 text-sm text-foreground/65">
                  {item.location} - Sell price: {item.price}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-forest-700/70">
                  Buy price: {item.purchasePrice || source?.price || "-"} - Profit: {profit.toLocaleString()}
                </p>
              </div>
              <div className="grid gap-2 text-xs text-foreground/70 sm:grid-cols-2">
                <p>Sold to: {item.soldToName || "-"}</p>
                <p>Phone: {item.soldToPhone || "-"}</p>
                <p>Location: {item.soldToLocation || "-"}</p>
                <p>Date: {item.sellDate || "-"}</p>
                <p>Status: {item.dealClosed ? "Closed" : "Open"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 rounded-sm bg-red-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ImageTile label="Buyer Aadhaar" src={item.soldToAadhaarImage} />
            <ImageTile label="Sale geo tag" src={item.soldToGeoTagImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SellWorkspace() {
  const { data: lands = [] } = useGetLandsQuery();
  const [createLand] = useCreateLandMutation();
  const [updateLand] = useUpdateLandMutation();
  const [deleteLand] = useDeleteLandMutation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LandRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [draft, setDraft] = useState<SellDraft>(emptyDraft());
  const [buyerAadhaarImage, setBuyerAadhaarImage] = useState("");
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const clearFeedback = useCallback(() => setFeedback(null), []);

  const buyOptions = useMemo(() => lands.filter((item) => item.intent === "Buy"), [lands]);
  const sellItems = useMemo(() => lands.filter((item) => item.intent === "Sell"), [lands]);
  const selectedSource = useMemo(
    () => buyOptions.find((item) => item.id === draft.sourceBuyId) ?? null,
    [buyOptions, draft.sourceBuyId],
  );

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(clearFeedback, 4000);
    return () => window.clearTimeout(timer);
  }, [feedback, clearFeedback]);

  useEffect(() => {
    if (!open || draft.sourceBuyId || !buyOptions.length) return;
    setDraft((current) => ({ ...current, sourceBuyId: buyOptions[0].id }));
  }, [buyOptions, draft.sourceBuyId, open]);

  function openCreate() {
    if (!buyOptions.length) {
      setFeedback({ kind: "error", text: "Add a buy record first." });
      return;
    }
    setEditing(null);
    setDraft(emptyDraft(buyOptions[0].id));
    setBuyerAadhaarImage("");
    setFormError("");
    clearFeedback();
    setOpen(true);
  }

  function beginEdit(item: LandRecord) {
    setEditing(item);
    setDraft({
      slug: item.slug,
      sourceBuyId: item.sourceBuyId ?? buyOptions.find((buy) => buy.title === item.title)?.id ?? buyOptions[0]?.id ?? "",
      soldToName: item.soldToName ?? "",
      soldToPhone: item.soldToPhone ?? "",
      soldToLocation: item.soldToLocation ?? "",
      soldToAadhaarImage: item.soldToAadhaarImage ?? "",
      soldToGeoTagImage: item.soldToGeoTagImage ?? "",
      sellDate: item.sellDate ?? new Date().toISOString().slice(0, 10),
      sellPrice: item.price ?? "",
      dealClosed: item.dealClosed ?? true,
    });
    setBuyerAadhaarImage(item.soldToAadhaarImage ?? "");
    setFormError("");
    clearFeedback();
    setOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await deleteLand(id).unwrap();
      setFeedback({ kind: "success", text: "Sell record deleted successfully." });
      setDeleteTarget(null);
    } catch (error) {
      setFeedback({ kind: "error", text: readErrorMessage(error, "Could not delete sell record.") });
    }
  }

  async function handleSave() {
    const source = buyOptions.find((item) => item.id === draft.sourceBuyId);
    if (!source) {
      setFormError("Select a purchased property.");
      return;
    }
    if (!draft.soldToName || !draft.soldToPhone || !draft.soldToLocation || !buyerAadhaarImage || !draft.soldToGeoTagImage || !draft.sellDate || !draft.sellPrice) {
      setFormError("Add buyer name, phone, location, geo tag, date, and sell price.");
      return;
    }

    const payload = {
      title: source.title,
      slug: draft.slug || slugify(`${source.slug}-sold-${draft.sellDate}`),
      intent: "Sell" as const,
      price: draft.sellPrice,
      purchasePrice: source.price,
      location: source.location,
      areaSize: source.areaSize,
      landType: source.landType,
      zoning: source.zoning,
      featured: false,
      sold: true,
      description: `Sold to ${draft.soldToName} from ${source.title}.`,
      investmentPotential: source.investmentPotential.length ? source.investmentPotential : [`Sale completed in ${source.location}`],
      nearbyLandmarks: source.nearbyLandmarks.length ? source.nearbyLandmarks : [source.location],
      coordinates: source.coordinates,
      image: source.image,
      gallery: source.gallery,
      sourceBuyId: source.id,
      purchasedFromName: source.purchasedFromName,
      purchasedFromPhone: source.purchasedFromPhone,
      purchaseDate: source.purchaseDate,
      aadhaarCardImage: source.aadhaarCardImage,
      geoTagImage: source.geoTagImage,
      soldToName: draft.soldToName,
      soldToPhone: draft.soldToPhone,
      soldToLocation: draft.soldToLocation,
      soldToAadhaarImage: buyerAadhaarImage,
      soldToGeoTagImage: draft.soldToGeoTagImage,
      sellDate: draft.sellDate,
      dealClosed: draft.dealClosed,
      contactPhone: source.contactPhone || site.phone,
      whatsapp: source.whatsapp || site.whatsapp,
      pricePerAcre: source.pricePerAcre,
    };

    try {
      if (editing) {
        await updateLand({ id: editing.id, ...payload }).unwrap();
        setFeedback({ kind: "success", text: "Sell record updated successfully." });
      } else {
        await createLand(payload).unwrap();
        setFeedback({ kind: "success", text: "Sell record saved successfully." });
      }
      setOpen(false);
      setEditing(null);
      setDraft(emptyDraft(buyOptions[0]?.id ?? ""));
      setBuyerAadhaarImage("");
      setFormError("");
    } catch (error) {
      setFeedback({ kind: "error", text: readErrorMessage(error, "Could not save sell record.") });
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Plus className="h-4 w-4" />
          Add sell land
        </button>
      </div>

      <MessageBanner feedback={feedback} onDismiss={clearFeedback} />

      <div className="mt-4 grid gap-3">
        {sellItems.map((item) => (
          <SellRecordCard
            key={item.id}
            item={item}
            source={buyOptions.find((buy) => buy.id === item.sourceBuyId) ?? null}
            onEdit={() => beginEdit(item)}
            onDelete={() => setDeleteTarget({ id: item.id, title: item.title })}
          />
        ))}
      </div>

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        title="Delete sell record?"
        message={`Are you sure you want to delete ${deleteTarget?.title ?? "this sell record"}? This cannot be undone.`}
        confirmLabel="Delete sell record"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await handleDelete(deleteTarget.id);
        }}
        onClose={() => setDeleteTarget(null)}
      />

      <AdminModal open={open} title={editing ? "Edit sell land" : "Add sell land"} onClose={() => setOpen(false)}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
          className="space-y-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Select purchased property</span>
              <select
                value={draft.sourceBuyId}
                onChange={(event) => setDraft({ ...draft, sourceBuyId: event.target.value })}
                className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none"
              >
                {buyOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} - {item.location}
                  </option>
                ))}
              </select>
            </label>

            {selectedSource ? (
              <div className="md:col-span-2 overflow-hidden rounded-sm border border-forest-900/10 bg-forest-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Linked buy record</p>
                <p className="mt-2 font-serif text-2xl text-forest-950">{selectedSource.title}</p>
                <p className="mt-1 text-sm text-foreground/65">
                  {selectedSource.location} - {selectedSource.areaSize} - {selectedSource.price}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-forest-700/70">
                  Purchased from {selectedSource.purchasedFromName} - {selectedSource.purchasedFromPhone} - {selectedSource.purchaseDate}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ImageTile label="Land image" src={selectedSource.image} />
                  <ImageTile label="Aadhaar" src={selectedSource.aadhaarCardImage} />
                  <ImageTile label="Geo tag" src={selectedSource.geoTagImage} />
                </div>
              </div>
            ) : null}

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Buyer name</span>
              <input value={draft.soldToName} onChange={(event) => setDraft({ ...draft, soldToName: event.target.value })} placeholder="Buyer name" className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Buyer phone</span>
              <input value={draft.soldToPhone} onChange={(event) => setDraft({ ...draft, soldToPhone: event.target.value })} placeholder="9999999999" className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Buyer location</span>
              <input value={draft.soldToLocation} onChange={(event) => setDraft({ ...draft, soldToLocation: event.target.value })} placeholder="Kupwara, Jammu and Kashmir" className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Sell date</span>
              <input type="date" value={draft.sellDate} onChange={(event) => setDraft({ ...draft, sellDate: event.target.value })} className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Sell price</span>
              <input value={draft.sellPrice} onChange={(event) => setDraft({ ...draft, sellPrice: event.target.value })} placeholder="1200000" className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none" />
            </label>
            <div className="md:col-span-2">
              <SingleImageInput
                label="Buyer Aadhaar image"
                value={buyerAadhaarImage}
                onChange={setBuyerAadhaarImage}
                helper="Upload the buyer's Aadhaar card image."
              />
            </div>

            <div className="md:col-span-2">
              <SingleImageInput
                label="Sale geo tag image"
                value={draft.soldToGeoTagImage}
                onChange={(value) => setDraft({ ...draft, soldToGeoTagImage: value })}
                helper="Upload the geo tag proof for this sale."
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between rounded-sm border border-forest-900/10 bg-forest-50 px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Deal closed</p>
                <p className="mt-1 text-sm text-foreground/65">Toggle if the sale is completed.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, dealClosed: !draft.dealClosed })}
                className={`rounded-sm px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  draft.dealClosed ? "bg-forest-950 text-white" : "bg-forest-100 text-forest-950"
                }`}
              >
                {draft.dealClosed ? "Closed" : "Open"}
              </button>
            </div>

            {selectedSource ? (
              <div className="md:col-span-2 rounded-sm border border-forest-900/10 bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Profit preview</p>
                <p className="mt-2 font-serif text-3xl text-forest-950">
                  {(parseMoney(draft.sellPrice) - parseMoney(selectedSource.price)).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  Buy price: {selectedSource.price} - Sell price: {draft.sellPrice || "-"}
                </p>
              </div>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
            >
              {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editing ? "Update sell" : "Save sell"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-sm bg-forest-100 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-950"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}

export function AdminSellPage() {
  return <SellWorkspace />;
}
