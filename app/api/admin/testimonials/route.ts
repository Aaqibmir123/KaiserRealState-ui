import { createTestimonial, getTestimonials } from "@/lib/repositories/testimonials";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { testimonialSchema } from "@/lib/validators";

export async function GET() {
  return jsonResponse(await getTestimonials());
}

export async function POST(request: Request) {
  const body = await parseRequestBody<unknown>(request);
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid testimonial payload", 400);
  }

  return jsonResponse(await createTestimonial(parsed.data), 201);
}

