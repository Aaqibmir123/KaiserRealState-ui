import { clearAdminCookies } from "@/lib/auth";
import { jsonResponse } from "@/lib/api";

export async function POST() {
  const response = jsonResponse({ ok: true }, 200);
  clearAdminCookies(response);
  return response;
}
