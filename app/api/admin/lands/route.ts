import { createLandController, listLandsController } from "@/backend/controllers/lands.controller";

export async function GET() {
  return listLandsController();
}

export async function POST(request: Request) {
  return createLandController(request);
}
