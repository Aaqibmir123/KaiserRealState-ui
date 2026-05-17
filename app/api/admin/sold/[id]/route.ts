import { deleteSoldRecord, updateSoldRecord } from "@/lib/repositories/sold";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { soldSchema } from "@/lib/validators";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await parseRequestBody<unknown>(request);
  const parsed = soldSchema.partial().safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid sold payload", 400);
  }

  const updated = await updateSoldRecord(id, parsed.data);
  if (!updated) {
    return errorResponse("Sold record not found", 404);
  }

  return jsonResponse(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteSoldRecord(id);
  return jsonResponse({ ok: true });
}

