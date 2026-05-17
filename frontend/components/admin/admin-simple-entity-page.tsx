"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BadgeCheck, PencilLine, Plus, Star, Trash2 } from "lucide-react";
import {
  useCreateInquiryMutation,
  useCreateTestimonialMutation,
  useDeleteInquiryMutation,
  useDeleteTestimonialMutation,
  useGetInquiriesQuery,
  useGetLandsQuery,
  useGetOwnerProfileQuery,
  useGetTestimonialsQuery,
  useUpdateInquiryMutation,
  useUpdateOwnerProfileMutation,
  useUpdateTestimonialMutation,
} from "@/frontend/store/api/kasierApi";
import { AdminModal } from "@/frontend/components/admin/admin-modal";
import { ConfirmActionModal } from "@/frontend/components/admin/confirm-action-modal";
import { SingleImageInput } from "@/frontend/components/admin/media-inputs";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-sm border border-forest-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="mt-2 font-serif text-2xl text-forest-950">{title}</h3>
        </div>
        {description ? <p className="max-w-2xl text-sm leading-7 text-foreground/65">{description}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function RecordList({ children }: { children: ReactNode }) {
  return <div className="mt-5 space-y-3">{children}</div>;
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? label}
        className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  minHeight = "min-h-24",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? label}
        className={`w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-3 text-sm outline-none ${minHeight}`}
      />
    </label>
  );
}

type ToastState = { kind: "success" | "error"; text: string } | null;

function ToastBanner({
  toast,
}: {
  toast: ToastState;
}) {
  if (!toast) return null;
  return (
    <div
      className={`rounded-sm border px-4 py-3 text-sm ${
        toast.kind === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      role="status"
      aria-live="polite"
    >
      {toast.text}
    </div>
  );
}

export function AdminSoldPage() {
  const { data: lands = [] } = useGetLandsQuery();
  const deals = useMemo(
    () =>
      [...lands].sort(
        (a, b) =>
          Number(new Date(b.updatedAt ?? b.createdAt ?? 0)) - Number(new Date(a.updatedAt ?? a.createdAt ?? 0)),
      ),
    [lands],
  );

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

  return (
    <>
      <SectionCard title="Deals" description="Track buy and sell deals in one clean list.">
        <RecordList>
          {deals.map((item) => {
            const isSell = item.intent === "Sell";
            const profit = isSell ? parseMoney(item.price) - parseMoney(item.purchasePrice) : 0;

            return (
              <div key={item.id || item.slug} className="overflow-hidden rounded-sm border border-forest-900/10 bg-white">
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-44 bg-forest-100">
                    {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : null}
                    <div className="absolute left-3 top-3 rounded-full bg-forest-950/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white">
                      {item.intent}
                    </div>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-2xl text-forest-950">{item.title}</p>
                        <p className="mt-1 text-sm text-foreground/65">
                          {item.location} - {item.areaSize}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-forest-700/70">
                          {isSell ? `Buy: ${item.purchasePrice || "-"} - Sell: ${item.price}` : `Price: ${item.price}`}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${
                          item.sold ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.sold ? "Closed" : "Open"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-xs text-foreground/70 sm:grid-cols-2">
                      {isSell ? (
                        <>
                          <p>Sold to: {item.soldToName || "-"}</p>
                          <p>Phone: {item.soldToPhone || "-"}</p>
                          <p>Location: {item.soldToLocation || "-"}</p>
                          <p>Sell date: {item.sellDate || "-"}</p>
                          <p>Profit: {profit.toLocaleString()}</p>
                        </>
                      ) : (
                        <>
                          <p>Purchased from: {item.purchasedFromName || "-"}</p>
                          <p>Phone: {item.purchasedFromPhone || "-"}</p>
                          <p>Purchase date: {item.purchaseDate || "-"}</p>
                          <p>Type: {item.landType}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </RecordList>
      </SectionCard>
    </>
  );
}

export function AdminTestimonialsPage() {
  const { data: testimonials = [] } = useGetTestimonialsQuery();
  const [createTestimonial] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photo, setPhoto] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [draft, setDraft] = useState({
    customerName: "",
    rating: "5",
    feedback: "",
    purchaseLocation: "",
    purchaseDate: "",
    videoPlaceholder: "",
  });

  function reset() {
    setEditingId(null);
    setDraft({
      customerName: "",
      rating: "5",
      feedback: "",
      purchaseLocation: "",
      purchaseDate: "",
      videoPlaceholder: "",
    });
    setPhoto("");
  }

  const clearToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 4000);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  function openEditor(item?: (typeof testimonials)[number]) {
    if (item) {
      setEditingId(item.id);
      setDraft({
        customerName: item.customerName,
        rating: String(item.rating),
        feedback: item.feedback,
        purchaseLocation: item.purchaseLocation,
        purchaseDate: item.purchaseDate,
        videoPlaceholder: item.videoPlaceholder,
      });
      setPhoto(item.photo);
    } else {
      reset();
    }
    setOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await deleteTestimonial(id).unwrap();
      setToast({ kind: "success", text: "Testimonial deleted." });
      setDeleteTarget(null);
    } catch {
      setToast({ kind: "error", text: "Could not delete testimonial." });
    }
  }

  return (
    <>
      <SectionCard title="Testimonials" description="Add client proof and keep the list tidy.">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => openEditor()}
            className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
          >
            <Plus className="h-4 w-4" />
            Add testimonial
          </button>
        </div>

        <div className="mt-4">
          <ToastBanner toast={toast} />
        </div>

        <RecordList>
          {testimonials.map((item, index) => (
            <div
              key={item.id || `${item.customerName}-${index}`}
              className="grid gap-4 rounded-sm border border-forest-900/10 bg-forest-50 p-4 md:grid-cols-[0.7fr_1.3fr_auto]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-forest-900/10 bg-white">
                {item.photo ? (
                  <Image src={item.photo} alt={item.customerName} fill unoptimized className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-foreground/45">No photo</div>
                )}
              </div>

              <div>
                <p className="font-semibold text-forest-950">{item.customerName}</p>
                <p className="mt-1 text-sm text-foreground/65">{item.purchaseLocation}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-forest-700/70">
                  {item.purchaseDate || "-"}
                </p>
                <div className="mt-2 flex items-center gap-1 text-gold-500">
                  {Array.from({ length: item.rating }).map((_, starIndex) => (
                    <Star key={`${item.id || item.customerName}-${starIndex}`} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">{item.feedback}</p>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                <button
                  type="button"
                  onClick={() => openEditor(item)}
                  className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-forest-950"
                >
                  <PencilLine className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: item.id, name: item.customerName })}
                  className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-forest-950"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </RecordList>
      </SectionCard>

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        title="Delete testimonial?"
        message={`Are you sure you want to delete ${deleteTarget?.name ?? "this testimonial"}? This cannot be undone.`}
        confirmLabel="Delete testimonial"
        onConfirm={() => {
          if (!deleteTarget) return;
          void handleDelete(deleteTarget.id);
        }}
        onClose={() => setDeleteTarget(null)}
      />

      <AdminModal
        open={open}
        title={editingId ? "Edit testimonial" : "Add testimonial"}
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const payload = {
              customerName: draft.customerName,
              rating: Number(draft.rating),
              feedback: draft.feedback,
              purchaseLocation: draft.purchaseLocation,
              purchaseDate: draft.purchaseDate,
              photo,
              videoPlaceholder: draft.videoPlaceholder || "Video testimonial",
            };
            void (async () => {
              try {
                if (editingId) {
                  await updateTestimonial({ id: editingId, ...payload }).unwrap();
                  setToast({ kind: "success", text: "Testimonial updated." });
                } else {
                  await createTestimonial(payload).unwrap();
                  setToast({ kind: "success", text: "Testimonial added." });
                }
                setOpen(false);
                reset();
              } catch {
                setToast({ kind: "error", text: "Could not save testimonial." });
              }
            })();
          }}
          className="grid gap-4"
        >
          <Field label="Customer name" value={draft.customerName} onChange={(value) => setDraft({ ...draft, customerName: value })} />
          <Field label="Rating" type="number" value={draft.rating} onChange={(value) => setDraft({ ...draft, rating: value })} />
          <Field label="Purchase location" value={draft.purchaseLocation} onChange={(value) => setDraft({ ...draft, purchaseLocation: value })} />
          <Field label="Purchase date" type="date" value={draft.purchaseDate} onChange={(value) => setDraft({ ...draft, purchaseDate: value })} />
          <TextAreaField label="Feedback" value={draft.feedback} onChange={(value) => setDraft({ ...draft, feedback: value })} />
          <SingleImageInput label="Customer photo" value={photo} onChange={setPhoto} />
          <Field label="Video note" value={draft.videoPlaceholder} onChange={(value) => setDraft({ ...draft, videoPlaceholder: value })} />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white">
              <Plus className="h-4 w-4" />
              Save testimonial
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}

export function AdminInquiriesPage() {
  const { data: inquiries = [] } = useGetInquiriesQuery();
  const [createInquiry] = useCreateInquiryMutation();
  const [updateInquiry] = useUpdateInquiryMutation();
  const [deleteInquiry] = useDeleteInquiryMutation();
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [draft, setDraft] = useState({
    customerName: "",
    phone: "",
    email: "",
    interestedLand: "",
    message: "",
    inquiryDate: "",
  });

  function reset() {
    setDraft({
      customerName: "",
      phone: "",
      email: "",
      interestedLand: "",
      message: "",
      inquiryDate: "",
    });
  }

  return (
    <>
      <SectionCard title="Inquiries" description="Handle leads quickly and keep the list visible.">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
          >
            <Plus className="h-4 w-4" />
            Add inquiry
          </button>
        </div>

        <RecordList>
          {inquiries.map((item) => (
            <div key={item.id} className="rounded-sm border border-forest-900/10 bg-forest-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-950">{item.customerName}</p>
                  <p className="mt-1 text-sm text-foreground/65">{item.interestedLand}</p>
                  <p className="mt-2 text-sm text-foreground/55">{item.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => void updateInquiry({ id: item.id, contacted: !item.contacted })} className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-forest-950">
                    <BadgeCheck className="h-4 w-4" />
                    {item.contacted ? "Reopen" : "Mark done"}
                  </button>
                  <button onClick={() => setDeleteTarget({ id: item.id, name: item.customerName })} className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-forest-950">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </RecordList>
      </SectionCard>

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        title="Delete inquiry?"
        message={`Are you sure you want to delete ${deleteTarget?.name ?? "this inquiry"}? This cannot be undone.`}
        confirmLabel="Delete inquiry"
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteInquiry(deleteTarget.id).unwrap();
            setDeleteTarget(null);
          } catch {
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />

      <AdminModal
        open={open}
        title="Add inquiry"
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void createInquiry({
              ...draft,
              contacted: false,
            });
            setOpen(false);
            reset();
          }}
          className="grid gap-4"
        >
          <Field label="Customer name" value={draft.customerName} onChange={(value) => setDraft({ ...draft, customerName: value })} />
          <Field label="Phone" value={draft.phone} onChange={(value) => setDraft({ ...draft, phone: value })} />
          <Field label="Email" type="email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
          <Field label="Interested land" value={draft.interestedLand} onChange={(value) => setDraft({ ...draft, interestedLand: value })} />
          <Field label="Inquiry date" type="date" value={draft.inquiryDate} onChange={(value) => setDraft({ ...draft, inquiryDate: value })} />
          <TextAreaField label="Message" value={draft.message} onChange={(value) => setDraft({ ...draft, message: value })} />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white">
              <Plus className="h-4 w-4" />
              Save inquiry
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}

export function AdminOwnerPage() {
  const { data: owner } = useGetOwnerProfileQuery();
  const [updateOwnerProfile] = useUpdateOwnerProfileMutation();
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    email: "",
    officeAddress: "",
  });

  function openEditor() {
    setDraft({
      name: owner?.name ?? "",
      phone: owner?.phone ?? "",
      email: owner?.email ?? "",
      officeAddress: owner?.officeAddress ?? "",
    });
    setPhoto(owner?.photo ?? "");
    setOpen(true);
  }

  return (
    <>
      <SectionCard title="Owner profile" description="Update the owner photo, name, phone, email, and office location only.">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
          >
            <PencilLine className="h-4 w-4" />
            Edit owner profile
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="overflow-hidden rounded-sm border border-forest-900/10 bg-white">
            <div className="border-b border-forest-900/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300">Profile photo</p>
            </div>
            <div className="relative aspect-[4/3] bg-forest-50">
              {owner?.photo ? (
                <Image src={owner.photo} alt={owner?.name ?? "Owner profile"} fill unoptimized className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-sm text-foreground/45">No profile photo</div>
              )}
            </div>
          </div>
          <div className="rounded-sm border border-forest-900/10 bg-forest-50 p-4">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Owner</p>
            <p className="mt-2 font-semibold text-forest-950">{owner?.name ?? "—"}</p>
            <p className="text-sm text-foreground/65">{owner?.email ?? "—"}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-gold-300">Contact</p>
            <p className="mt-2 text-sm text-foreground/70">{owner?.phone ?? "—"}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-gold-300">Office location</p>
            <p className="mt-2 text-sm text-foreground/70">{owner?.officeAddress ?? "—"}</p>
          </div>
        </div>
      </SectionCard>

      <AdminModal open={open} title="Edit owner profile" onClose={() => setOpen(false)}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void updateOwnerProfile({ ...draft, photo });
            setOpen(false);
          }}
          className="grid gap-4"
        >
          <SingleImageInput label="Owner photo" value={photo} onChange={setPhoto} />
          <Field label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
          <Field label="Phone" value={draft.phone} onChange={(value) => setDraft({ ...draft, phone: value })} />
          <Field label="Email" type="email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
          <Field
            label="Office location"
            value={draft.officeAddress}
            onChange={(value) => setDraft({ ...draft, officeAddress: value })}
          />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white">
              <PencilLine className="h-4 w-4" />
              Save owner profile
            </button>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-sm border border-forest-900/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-forest-950">
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
