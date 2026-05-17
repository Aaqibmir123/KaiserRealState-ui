import {
  deleteLandController,
  getLandController,
  updateLandController,
} from "@/backend/controllers/lands.controller";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getLandController(id);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return updateLandController(request, id);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteLandController(id);
}
