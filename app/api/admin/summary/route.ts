import { getDashboardSummary } from "@/lib/repositories/summary";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  return jsonResponse(await getDashboardSummary());
}

