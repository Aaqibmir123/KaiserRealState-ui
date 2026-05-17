import { connectToDatabase } from "@/lib/db";
import { LandModel } from "@/lib/models/land";
import type { LandRecord } from "@/types";
import type { LandInput } from "@/lib/validators";
import { persistImageSource, persistImageSources } from "@/backend/uploads";

const toLand = (doc: Record<string, unknown>): LandRecord =>
  JSON.parse(
    JSON.stringify({
      ...doc,
      id: doc.id ?? doc._id ?? "",
    }),
  ) as LandRecord;

async function normalizeLandInput(input: Partial<LandInput>) {
  const next = { ...input } as Partial<LandInput>;

  if (typeof next.image === "string") next.image = await persistImageSource(next.image, "lands");
  if (Array.isArray(next.gallery)) next.gallery = await persistImageSources(next.gallery, "lands");
  if (typeof next.aadhaarCardImage === "string") next.aadhaarCardImage = await persistImageSource(next.aadhaarCardImage, "lands");
  if (typeof next.geoTagImage === "string") next.geoTagImage = await persistImageSource(next.geoTagImage, "lands");
  if (typeof next.soldToAadhaarImage === "string") next.soldToAadhaarImage = await persistImageSource(next.soldToAadhaarImage, "lands");
  if (typeof next.soldToGeoTagImage === "string") next.soldToGeoTagImage = await persistImageSource(next.soldToGeoTagImage, "lands");

  return next;
}

export async function getLands() {
  await connectToDatabase();
  const docs = await LandModel.find().sort({ featured: -1, createdAt: -1 }).lean();
  return docs.map(toLand);
}

export async function getLandBySlug(slug: string) {
  await connectToDatabase();
  const doc = await LandModel.findOne({ slug }).lean();
  return doc ? toLand(doc as Record<string, unknown>) : null;
}

export async function getLandById(id: string) {
  await connectToDatabase();
  const doc = await LandModel.findById(id).lean();
  return doc ? toLand(doc as Record<string, unknown>) : null;
}

export async function createLand(input: LandInput) {
  await connectToDatabase();
  const doc = await LandModel.create(await normalizeLandInput(input));
  return toLand(doc.toObject());
}

export async function updateLand(id: string, input: Partial<LandInput>) {
  await connectToDatabase();
  const doc = await LandModel.findByIdAndUpdate(id, await normalizeLandInput(input), { new: true }).lean();
  return doc ? toLand(doc as Record<string, unknown>) : null;
}

export async function deleteLand(id: string) {
  await connectToDatabase();
  await LandModel.findByIdAndDelete(id);
  return true;
}
