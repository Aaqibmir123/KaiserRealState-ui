"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { Upload } from "lucide-react";

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function useDataUrlGallery(initial: string[] = []) {
  const [items, setItems] = useState<string[]>(initial);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const urls = await Promise.all(Array.from(files).map(fileToDataUrl));
    setItems((current) => [...current, ...urls]);
  }

  function removeAt(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return { items, setItems, addFiles, removeAt };
}

export function SingleImageInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  const id = useId();
  const preview = useMemo(() => value || "", [value]);

  async function handleFileChange(file: File | null) {
    if (!file) return;
    onChange(await fileToDataUrl(file));
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </label>
      <div className="space-y-2">
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)}
          className="w-full rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2.5 text-sm outline-none"
        />
        {preview ? (
          <div className="relative overflow-hidden rounded-sm border border-forest-900/10 bg-white">
            <Image src={preview} alt={label} width={960} height={320} unoptimized className="h-28 w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 inline-flex items-center rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
      {helper ? <p className="text-xs text-foreground/50">{helper}</p> : null}
    </div>
  );
}

export function GalleryInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const id = useId();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const urls = await Promise.all(Array.from(files).map(fileToDataUrl));
    onChange([...value, ...urls]);
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={id}
          className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-forest-900/15 bg-forest-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-950"
        >
          <Upload className="h-4 w-4" />
          Upload Images
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => void handleFiles(event.target.files)}
          className="hidden"
        />
      </div>
      {value.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {value.map((item, index) => (
            <div key={`${item}-${index}`} className="relative overflow-hidden rounded-sm border border-forest-900/10 bg-white">
              <Image src={item} alt={`${label} ${index + 1}`} width={640} height={240} unoptimized className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                className="absolute right-2 top-2 rounded-full bg-forest-950/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
