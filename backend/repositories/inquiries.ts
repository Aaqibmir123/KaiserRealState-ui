import { connectToDatabase } from "@/lib/db";
import { InquiryModel } from "@/lib/models/inquiry";
import type { InquiryRecord } from "@/types";
import type { InquiryInput } from "@/lib/validators";

const toInquiry = (doc: Record<string, unknown>): InquiryRecord =>
  JSON.parse(
    JSON.stringify({
      ...doc,
      id: doc.id ?? doc._id ?? "",
    }),
  ) as InquiryRecord;

export async function getInquiries() {
  await connectToDatabase();
  const docs = await InquiryModel.find().sort({ contacted: 1, createdAt: -1 }).lean();
  return docs.map(toInquiry);
}

export async function createInquiry(input: InquiryInput) {
  const payload = {
    ...input,
    inquiryDate: input.inquiryDate ?? new Date().toISOString().slice(0, 10),
    contacted: input.contacted ?? false,
  };
  await connectToDatabase();
  const doc = await InquiryModel.create(payload);
  return toInquiry(doc.toObject());
}

export async function updateInquiry(id: string, input: Partial<InquiryInput> & { contacted?: boolean }) {
  await connectToDatabase();
  const doc = await InquiryModel.findByIdAndUpdate(id, input, { new: true }).lean();
  return doc ? toInquiry(doc as Record<string, unknown>) : null;
}

export async function deleteInquiry(id: string) {
  await connectToDatabase();
  await InquiryModel.findByIdAndDelete(id);
  return true;
}
