import { API_BASE_URL } from "@/constants/api";
import type { LandRecord, SoldRecord, TestimonialRecord } from "@/types";

function endpoint(path: string) {
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(endpoint(path), { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as T[] | { data?: T[] };
    if (Array.isArray(payload)) {
      return payload;
    }
    return payload.data ?? [];
  } catch {
    return [];
  }
}

async function fetchItem<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(endpoint(path), { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as T | { data?: T | null };
    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data ?? null;
    }
    return payload as T;
  } catch {
    return null;
  }
}

export async function getLands() {
  return fetchList<LandRecord>("lands");
}

export async function getLandBySlug(slug: string) {
  return fetchItem<LandRecord>(`lands/${slug}`);
}

export async function getTestimonials() {
  return fetchList<TestimonialRecord>("testimonials");
}

export async function getSoldRecords() {
  return fetchList<SoldRecord>("sold");
}
