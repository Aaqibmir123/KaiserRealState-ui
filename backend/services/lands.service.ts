import {
  createLand as createLandRecord,
  deleteLand as deleteLandRecord,
  getLandById as findLandById,
  getLandBySlug as findLandBySlug,
  getLands as listLands,
  updateLand as updateLandRecord,
} from "@/backend/repositories/lands";
import type { LandInput } from "@/backend/validators";

export { findLandById, findLandBySlug, listLands };

export async function createLand(input: LandInput) {
  return createLandRecord(input);
}

export async function updateLand(id: string, input: Partial<LandInput>) {
  return updateLandRecord(id, input);
}

export async function deleteLand(id: string) {
  return deleteLandRecord(id);
}
