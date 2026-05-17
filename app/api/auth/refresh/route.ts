import { getAdminSessionFromCookies, getAdminAccessCookieName, getAdminCookieOptions } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api";

export async function POST() {
  const session = await getAdminSessionFromCookies();

  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const response = jsonResponse({ authenticated: true, user: session.user }, 200);
  if (session.rotatedAccessToken) {
    response.cookies.set(getAdminAccessCookieName(), session.rotatedAccessToken, {
      ...getAdminCookieOptions(60 * 15),
    });
  }

  return response;
}

