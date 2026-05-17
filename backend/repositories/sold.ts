import { connectToDatabase } from "@/lib/db";
import { SoldModel } from "@/lib/models/sold";
import type { SoldRecord } from "@/types";
import type { SoldInput } from "@/lib/validators";

const toSold = (doc: Record<string, unknown>): SoldRecord =>
  JSON.parse(
    JSON.stringify({
      ...doc,
      id: doc.id ?? doc._id ?? "",
    }),
  ) as SoldRecord;

export async function getSoldRecords() {
  await connectToDatabase();
  const docs = await SoldModel.find().sort({ saleDate: -1, createdAt: -1 }).lean();
  return docs.map(toSold);
}

export async function createSoldRecord(input: SoldInput) {
  await connectToDatabase();
  const doc = await SoldModel.create(input);
  return toSold(doc.toObject());
}

export async function updateSoldRecord(id: string, input: Partial<SoldInput>) {
  await connectToDatabase();
  const doc = await SoldModel.findByIdAndUpdate(id, input, { new: true }).lean();
  return doc ? toSold(doc as Record<string, unknown>) : null;
}

export async function deleteSoldRecord(id: string) {
  await connectToDatabase();
  await SoldModel.findByIdAndDelete(id);
  return true;
}
