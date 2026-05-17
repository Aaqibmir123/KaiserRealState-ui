"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, Save, Trash2 } from "lucide-react";
import { site } from "@/constants/site";
import {
  useCreateLandMutation,
  useDeleteLandMutation,
  useGetLandsQuery,
  useUpdateLandMutation,
} from "@/frontend/store/api/kasierApi";
import { AdminModal } from "@/frontend/components/admin/admin-modal";
import { ConfirmActionModal } from "@/frontend/components/admin/confirm-action-modal";
import { GalleryInput, SingleImageInput } from "@/frontend/components/admin/media-inputs";
import type { Intent, LandRecord } from "@/types";

type Feedback = { kind: "success" | "error"; text: string } | null;

type LandDraft = {
  title: string;
  slug: string;
  price: string;
  location: string;
  areaSize: string;
  gallery: string[];
  purchasedFromName: string;
  purchasedFromPhone: string;
  purchaseDate: string;
  aadhaarCardImage: string;
  geoTagImage: string;
};

const emptyDraft: LandDraft = {
  title: "",
  slug: "",
  price: "",
  location: "",
  areaSize: "",
  gallery: [],
  purchasedFromName: "",
  purchasedFromPhone: "",
  purchaseDate: "",
  aadhaarCardImage: "",
  geoTagImage: "",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseMoney = (value: string | number | undefined | null) => {
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
};

function toDraft(item: LandRecord): LandDraft {
  return {
    title: item.title,
    slug: item.slug,
    price: item.price,
    location: item.location,
    areaSize: item.areaSize,
    gallery: item.gallery,
    purchasedFromName: item.purchasedFromName ?? "",
    purchasedFromPhone: item.purchasedFromPhone ?? "",
    purchaseDate: item.purchaseDate ?? "",
    aadhaarCardImage: item.aadhaarCardImage ?? "",
    geoTagImage: item.geoTagImage ?? "",
  };
}

function buildPayload(draft: LandDraft, intent: Intent) {
  const purchaseSummary = draft.purchasedFromName
    ? `Purchased from ${draft.purchasedFromName} in ${draft.location}.`
    : `Purchase record for ${draft.title} in ${draft.location}.`;

  return {
    title: draft.title,
    slug: draft.slug || slugify(draft.title),
    intent,
    price: draft.price,
    purchasePrice: draft.price,
    location: draft.location,
    areaSize: draft.areaSize,
    landType: "Land",
    zoning: "General land use",
    featured: false,
    sold: false,
    description: purchaseSummary,
    investmentPotential: [purchaseSummary, `Long-term value in ${draft.location}`],
    nearbyLandmarks: [draft.purchaseDate ? `Purchased on ${draft.purchaseDate}` : "Verified by owner"],
    coordinates: "34.0837, 74.7973",
    image: draft.gallery[0] ?? draft.geoTagImage ?? draft.aadhaarCardImage ?? "",
    gallery: draft.gallery,
    purchasedFromName: draft.purchasedFromName,
    purchasedFromPhone: draft.purchasedFromPhone,
    purchaseDate: draft.purchaseDate,
    aadhaarCardImage: draft.aadhaarCardImage,
    geoTagImage: draft.geoTagImage,
    contactPhone: site.phone,
    whatsapp: site.whatsapp,
    pricePerAcre: draft.price,
  };
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

function LandFormFields({
  draft,
  setDraft,
}: {
  draft: LandDraft;
  setDraft: (value: LandDraft) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        placeholder="Title"
        className="rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
      />
      <input
        value={draft.price}
        onChange={(event) => setDraft({ ...draft, price: event.target.value })}
        placeholder="Price"
        className="rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
      />
      <input
        value={draft.location}
        onChange={(event) => setDraft({ ...draft, location: event.target.value })}
        placeholder="Location"
        className="rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
      />
      <input
        value={draft.areaSize}
        onChange={(event) => setDraft({ ...draft, areaSize: event.target.value })}
        placeholder="Area size"
        className="rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
      />
      <input
        value={draft.purchasedFromName}
        onChange={(event) => setDraft({ ...draft, purchasedFromName: event.target.value })}
        placeholder="Purchased from"
        className="rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
      />
      <input
        value={draft.purchasedFromPhone}
        onChange={(event) => setDraft({ ...draft, purchasedFromPhone: event.target.value })}
        placeholder="Phone number"
        className="rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
      />
      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">Purchase date</span>
        <input
          type="date"
          value={draft.purchaseDate}
          onChange={(event) => setDraft({ ...draft, purchaseDate: event.target.value })}
          className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-sm outline-none"
        />
      </label>
      <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
        <SingleImageInput
          label="Aadhaar card"
          value={draft.aadhaarCardImage}
          onChange={(value) => setDraft({ ...draft, aadhaarCardImage: value })}
          helper="Upload the seller's Aadhaar card image."
        />
        <SingleImageInput
          label="Geo tag image"
          value={draft.geoTagImage}
          onChange={(value) => setDraft({ ...draft, geoTagImage: value })}
          helper="Upload the geo tag or site proof image."
        />
      </div>
      <div className="md:col-span-2">
        <GalleryInput
          label="Upload Images"
          value={draft.gallery}
          onChange={(value) => setDraft({ ...draft, gallery: value })}
        />
      </div>
    </div>
  );
}

function LandCard({
  item,
  onEdit,
  onDelete,
}: {
  item: LandRecord;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const galleryPreview = useMemo(
    () => [item.image, ...item.gallery.filter((src) => src !== item.image)].filter(Boolean).slice(0, 4),
    [item.gallery, item.image],
  );
  const isSell = item.intent === "Sell";
  const sellProfit = isSell ? parseMoney(item.price) - parseMoney(item.purchasePrice) : 0;

  return (
    <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-white">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-52 bg-forest-100">
          {item.image ? (
            <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
          ) : null}
          <div className="absolute left-3 top-3 rounded-full bg-forest-950/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white">
            {item.intent}
          </div>
        </div>
        <div className="p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div>
                <p className="font-serif text-2xl text-forest-950">{item.title}</p>
                <p className="mt-1 text-sm text-foreground/65">
                  {item.location} - {item.price}
                </p>
              </div>
              <div className="grid gap-2 text-xs text-foreground/70 sm:grid-cols-2">
                {isSell ? (
                  <>
                    <p>Sold to: {item.soldToName || "-"}</p>
                    <p>Phone: {item.soldToPhone || "-"}</p>
                    <p>Location: {item.soldToLocation || "-"}</p>
                    <p>Sell date: {item.sellDate || "-"}</p>
                    <p>Profit: {sellProfit.toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p>Purchased from: {item.purchasedFromName || "-"}</p>
                    <p>Phone: {item.purchasedFromPhone || "-"}</p>
                    <p>Date: {item.purchaseDate || "-"}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                <PencilLine className="h-4 w-4" />
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

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { label: "Land image", src: item.image },
              { label: "Aadhaar", src: item.aadhaarCardImage },
              { label: "Geo tag", src: item.geoTagImage },
            ].map((entry) => (
              <div key={entry.label} className="overflow-hidden rounded-sm border border-forest-900/10 bg-forest-50">
                <div className="border-b border-forest-900/10 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-forest-700">
                  {entry.label}
                </div>
                <div className="relative pt-[62%]">
                  {entry.src ? (
                    <Image src={entry.src} alt={`${item.title} ${entry.label}`} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-xs text-foreground/45">
                      Missing
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {galleryPreview.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {galleryPreview.map((src, index) => (
                <div key={`${src}-${index}`} className="relative overflow-hidden rounded-sm bg-forest-50 pt-[70%]">
                  <Image src={src} alt={`${item.title} gallery ${index + 1}`} fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function readErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;
  const response = error as { data?: { error?: string } };
  return response.data?.error ?? fallback;
}

function LandsWorkspace({ intent }: { intent: Intent }) {
  const { data: lands = [] } = useGetLandsQuery();
  const [createLand] = useCreateLandMutation();
  const [updateLand] = useUpdateLandMutation();
  const [deleteLand] = useDeleteLandMutation();
  const [draft, setDraft] = useState<LandDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const clearFeedback = useCallback(() => setFeedback(null), []);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(clearFeedback, 4000);
    return () => window.clearTimeout(timer);
  }, [feedback, clearFeedback]);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormError("");
    clearFeedback();
    setOpen(true);
  }

  async function handleSave() {
    if (!draft.gallery.length) {
      setFormError("Upload at least one land image.");
      return;
    }
    if (!draft.aadhaarCardImage) {
      setFormError("Upload the Aadhaar card image.");
      return;
    }
    if (!draft.geoTagImage) {
      setFormError("Upload the geo tag image.");
      return;
    }

    const payload = buildPayload(draft, intent);

    try {
      if (editingId) {
        await updateLand({ id: editingId, ...payload }).unwrap();
        setFeedback({ kind: "success", text: `${intent} land updated successfully.` });
      } else {
        await createLand(payload).unwrap();
        setFeedback({ kind: "success", text: `${intent} land saved successfully.` });
      }
      setOpen(false);
      setEditingId(null);
      setDraft(emptyDraft);
      setFormError("");
    } catch (error) {
      setFeedback({ kind: "error", text: readErrorMessage(error, "Could not save land. Please check the entered details.") });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteLand(id).unwrap();
      setFeedback({ kind: "success", text: "Land deleted successfully." });
      setDeleteTarget(null);
    } catch (error) {
      setFeedback({ kind: "error", text: readErrorMessage(error, "Could not delete land.") });
    }
  }

  const visibleLands = lands.filter((item) => item.intent === intent);

  return (
    <>
      <div className="flex items-center justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Plus className="h-4 w-4" />
          Add land
        </button>
      </div>

      <div className="mt-4">
        <MessageBanner feedback={feedback} onDismiss={clearFeedback} />
      </div>

      <div className="mt-4 grid gap-3">
        {visibleLands.map((item) => (
          <LandCard
            key={item.id || item.slug}
            item={item}
            onEdit={() => {
              setEditingId(item.id);
              setDraft(toDraft(item));
              setFormError("");
              clearFeedback();
              setOpen(true);
            }}
            onDelete={() => setDeleteTarget({ id: item.id, title: item.title })}
          />
        ))}
      </div>

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        title="Delete land?"
        message={`Are you sure you want to delete ${deleteTarget?.title ?? "this land"}? This cannot be undone.`}
        confirmLabel="Delete land"
        onConfirm={() => {
          if (!deleteTarget) return;
          void handleDelete(deleteTarget.id);
        }}
        onClose={() => setDeleteTarget(null)}
      />

      <AdminModal
        open={open}
        title={editingId ? `Edit ${intent.toLowerCase()} land` : `Add ${intent.toLowerCase()} land`}
        onClose={() => setOpen(false)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
          className="space-y-5"
        >
          <LandFormFields draft={draft} setDraft={setDraft} />
          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "Update land" : "Save land"}
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

function LandsList({ showCreateButton = true }: { showCreateButton?: boolean }) {
  const { data: lands = [] } = useGetLandsQuery();
  const [deleteLand] = useDeleteLandMutation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LandRecord | null>(null);
  const [draft, setDraft] = useState<LandDraft>(emptyDraft);
  const [createLand] = useCreateLandMutation();
  const [updateLand] = useUpdateLandMutation();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const clearFeedback = useCallback(() => setFeedback(null), []);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(clearFeedback, 4000);
    return () => window.clearTimeout(timer);
  }, [feedback, clearFeedback]);

  function beginEdit(item: LandRecord) {
    setEditing(item);
    setDraft(toDraft(item));
    setFormError("");
    clearFeedback();
    setOpen(true);
  }

  async function save() {
    if (!draft.gallery.length) {
      setFormError("Upload at least one land image.");
      return;
    }
    if (!draft.aadhaarCardImage) {
      setFormError("Upload the Aadhaar card image.");
      return;
    }
    if (!draft.geoTagImage) {
      setFormError("Upload the geo tag image.");
      return;
    }

    const payload = buildPayload(draft, editing?.intent ?? "Buy");
    try {
      if (editing) {
        await updateLand({ id: editing.id, ...payload }).unwrap();
        setFeedback({ kind: "success", text: "Land updated successfully." });
      } else {
        await createLand(payload).unwrap();
        setFeedback({ kind: "success", text: "Land saved successfully." });
      }
      setOpen(false);
      setEditing(null);
      setDraft(emptyDraft);
      setFormError("");
    } catch (error) {
      setFeedback({ kind: "error", text: readErrorMessage(error, "Could not save land.") });
    }
  }

  async function removeLand(id: string) {
    try {
      await deleteLand(id).unwrap();
      setFeedback({ kind: "success", text: "Land deleted successfully." });
      setDeleteTarget(null);
    } catch (error) {
      setFeedback({ kind: "error", text: readErrorMessage(error, "Could not delete land.") });
    }
  }

  return (
    <>
      {showCreateButton ? (
        <div className="mb-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setDraft(emptyDraft);
              setFormError("");
              clearFeedback();
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
          >
            <Plus className="h-4 w-4" />
            Add land
          </button>
        </div>
      ) : null}

      <MessageBanner feedback={feedback} onDismiss={clearFeedback} />

      <div className="mt-4 grid gap-3">
        {lands.map((item) => (
          <LandCard
            key={item.id || item.slug}
            item={item}
            onEdit={() => beginEdit(item)}
            onDelete={() => setDeleteTarget({ id: item.id, title: item.title })}
          />
        ))}
      </div>

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        title="Delete land?"
        message={`Are you sure you want to delete ${deleteTarget?.title ?? "this land"}? This cannot be undone.`}
        confirmLabel="Delete land"
        onConfirm={() => {
          if (!deleteTarget) return;
          void removeLand(deleteTarget.id);
        }}
        onClose={() => setDeleteTarget(null)}
      />

      <AdminModal
        open={open}
        title={editing ? "Edit land" : "Add land"}
        onClose={() => setOpen(false)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
          className="space-y-5"
        >
          <LandFormFields draft={draft} setDraft={setDraft} />
          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
            >
              {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editing ? "Update land" : "Save land"}
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

function LandsChooser() {
  return (
    <section className="flex flex-wrap items-center gap-3">
      <Link
        href="/admin/lands/buy"
        className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-forest-800"
      >
        Buy
      </Link>
      <Link
        href="/admin/lands/sell"
        className="inline-flex items-center gap-2 rounded-sm bg-forest-100 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-forest-200"
      >
        Sell
      </Link>
    </section>
  );
}

export function AdminLandsPage({ intent }: { intent?: Intent } = {}) {
  if (!intent) {
    return <LandsChooser />;
  }

  return <LandsWorkspace intent={intent} />;
}

export function AdminLandsListPage() {
  return <LandsList />;
}
