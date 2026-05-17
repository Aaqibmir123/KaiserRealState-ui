import { getOwnerProfile, updateOwnerProfile } from "@/lib/repositories/owner";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { ownerSchema } from "@/lib/validators";

export async function GET() {
  return jsonResponse(await getOwnerProfile());
}

export async function PUT(request: Request) {
  const body = await parseRequestBody<unknown>(request);
  const parsed = ownerSchema.partial().safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid owner payload", 400);
  }

  return jsonResponse(await updateOwnerProfile(parsed.data));
}

