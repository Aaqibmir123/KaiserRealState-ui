import { loginSchema } from "@/lib/validators";
import {
  createAdminSession,
  getAdminCookieOptions,
  getAdminAccessCookieName,
  verifyAdminCredentials,
} from "@/lib/auth";
import { errorResponse, jsonResponse, parseRequestBody } from "@/lib/api";

export async function POST(request: Request) {
  const body = await parseRequestBody<unknown>(request);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid login payload", 400);
  }

  const user = await verifyAdminCredentials(parsed.data.identifier, parsed.data.password);
  if (!user) {
    return errorResponse("Invalid admin credentials", 401);
  }

  const session = await createAdminSession(user);
  const response = jsonResponse({ user }, 200);

  response.cookies.set(getAdminAccessCookieName(), session.accessToken, {
    ...getAdminCookieOptions(60 * 15),
  });
  response.cookies.set("kasier-admin-refresh", session.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
