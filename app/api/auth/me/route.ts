import { getAdminSessionFromCookies, getAdminAccessCookieName, getAdminCookieOptions } from "@/lib/auth";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const session = await getAdminSessionFromCookies();

  if (!session) {
    return jsonResponse({ authenticated: false, user: null }, 200);
  }

  const response = jsonResponse({ authenticated: true, user: session.user }, 200);
  if (session.rotatedAccessToken) {
    response.cookies.set(getAdminAccessCookieName(), session.rotatedAccessToken, {
      ...getAdminCookieOptions(60 * 15),
    });
  }

  return response;
}

