import { connectToDatabase } from "@/lib/db";
import { OwnerModel } from "@/lib/models/owner";
import { ownerProfile } from "@/constants/site";
import type { OwnerProfile } from "@/types";
import type { OwnerInput } from "@/lib/validators";

const toOwner = (doc: Record<string, unknown>): OwnerProfile =>
  JSON.parse(JSON.stringify(doc)) as OwnerProfile;

export async function getOwnerProfile() {
  await connectToDatabase();
  const doc = await OwnerModel.findOne().sort({ createdAt: -1 }).lean();
  if (doc) return toOwner(doc as Record<string, unknown>);
  const created = await OwnerModel.create(ownerProfile);
  return toOwner(created.toObject());
}

export async function updateOwnerProfile(input: Partial<OwnerInput>) {
  await connectToDatabase();
  const existing = await OwnerModel.findOne().sort({ createdAt: -1 });
  if (!existing) {
    const created = await OwnerModel.create(input);
    return toOwner(created.toObject());
  }
  Object.assign(existing, input);
  await existing.save();
  return toOwner(existing.toObject());
}

export async function seedOwnerProfile(input: OwnerInput) {
  await connectToDatabase();
  const created = await OwnerModel.create(input);
  return toOwner(created.toObject());
}
