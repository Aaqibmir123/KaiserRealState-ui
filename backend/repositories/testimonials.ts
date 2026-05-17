import { connectToDatabase } from "@/lib/db";
import { TestimonialModel } from "@/lib/models/testimonial";
import type { TestimonialRecord } from "@/types";
import type { TestimonialInput } from "@/lib/validators";

const toTestimonial = (doc: Record<string, unknown>): TestimonialRecord =>
  JSON.parse(
    JSON.stringify({
      ...doc,
      id: doc.id ?? doc._id ?? "",
    }),
  ) as TestimonialRecord;

export async function getTestimonials() {
  await connectToDatabase();
  const docs = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
  return docs.map(toTestimonial);
}

export async function createTestimonial(input: TestimonialInput) {
  await connectToDatabase();
  const doc = await TestimonialModel.create(input);
  return toTestimonial(doc.toObject());
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>) {
  await connectToDatabase();
  const doc = await TestimonialModel.findByIdAndUpdate(id, input, { new: true }).lean();
  return doc ? toTestimonial(doc as Record<string, unknown>) : null;
}

export async function deleteTestimonial(id: string) {
  await connectToDatabase();
  await TestimonialModel.findByIdAndDelete(id);
  return true;
}
