import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";
import { landSchema, landUpdateSchema } from "@/lib/validators";
import {
  createLand,
  deleteLand,
  findLandById,
  listLands,
  updateLand,
} from "@/backend/services/lands.service";

export async function listLandsController() {
  return jsonResponse(await listLands());
}

export async function createLandController(request: Request) {
  const body = await parseRequestBody<unknown>(request);
  const parsed = landSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid land payload", 400);
  }
  return jsonResponse(await createLand(parsed.data), 201);
}

export async function getLandController(id: string) {
  const land = await findLandById(id);
  return land ? jsonResponse(land) : errorResponse("Land not found", 404);
}

export async function updateLandController(request: Request, id: string) {
  try {
    const body = await parseRequestBody<unknown>(request);
    const parsed = landUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid land payload", 400);
    }
    const updated = await updateLand(id, parsed.data);
    return updated ? jsonResponse(updated) : errorResponse("Land not found", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update land";
    return errorResponse(message, 500);
  }
}

export async function deleteLandController(id: string) {
  await deleteLand(id);
  return jsonResponse({ ok: true });
}
