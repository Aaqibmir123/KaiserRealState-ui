import { createInquiry, getInquiries } from "@/lib/repositories/inquiries";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { inquirySchema } from "@/lib/validators";

export async function GET() {
  return jsonResponse(await getInquiries());
}

export async function POST(request: Request) {
  const body = await parseRequestBody<unknown>(request);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid inquiry payload", 400);
  }

  return jsonResponse(await createInquiry(parsed.data), 201);
}

