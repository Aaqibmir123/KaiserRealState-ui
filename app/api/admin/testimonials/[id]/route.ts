import { deleteTestimonial, updateTestimonial } from "@/lib/repositories/testimonials";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { testimonialSchema } from "@/lib/validators";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await parseRequestBody<unknown>(request);
  const parsed = testimonialSchema.partial().safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid testimonial payload", 400);
  }

  const updated = await updateTestimonial(id, parsed.data);
  if (!updated) {
    return errorResponse("Testimonial not found", 404);
  }

  return jsonResponse(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteTestimonial(id);
  return jsonResponse({ ok: true });
}

