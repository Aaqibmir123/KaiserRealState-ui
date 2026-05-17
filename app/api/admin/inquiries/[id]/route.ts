import { deleteInquiry, updateInquiry } from "@/lib/repositories/inquiries";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { inquirySchema } from "@/lib/validators";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await parseRequestBody<unknown>(request);
  const parsed = inquirySchema.partial().safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid inquiry payload", 400);
  }

  const updated = await updateInquiry(id, parsed.data);
  if (!updated) {
    return errorResponse("Inquiry not found", 404);
  }

  return jsonResponse(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteInquiry(id);
  return jsonResponse({ ok: true });
}

