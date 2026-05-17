import { createSoldRecord, getSoldRecords } from "@/lib/repositories/sold";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { soldSchema } from "@/lib/validators";

export async function GET() {
  return jsonResponse(await getSoldRecords());
}

export async function POST(request: Request) {
  const body = await parseRequestBody<unknown>(request);
  const parsed = soldSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid sold payload", 400);
  }

  return jsonResponse(await createSoldRecord(parsed.data), 201);
}

