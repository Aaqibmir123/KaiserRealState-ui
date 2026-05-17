import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const accessTokenName = "kasier-admin-token";
const refreshTokenName = "kasier-admin-refresh";
const issuer = "kasierwebsitee";
const audience = "kasier-admin";
const accessMaxAge = 60 * 15;

function secretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "kasierwebsitee-secret-change-me");
}

async function verifyToken(token: string, kind: "access" | "refresh") {
  const { payload } = await jwtVerify(token, secretKey(), { issuer, audience });
  if (kind === "refresh" && payload.kind !== "refresh") {
    throw new Error("Invalid token kind");
  }

  return {
    id: payload.sub ?? "admin",
    email: String(payload.email ?? ""),
    name: String(payload.name ?? ""),
  };
}

async function createAccessToken(user: { id: string; email: string; name: string }) {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${accessMaxAge}s`)
    .sign(secretKey());
}

async function resolveSession(request: NextRequest) {
  const accessToken = request.cookies.get(accessTokenName)?.value;
  if (accessToken) {
    try {
      return { user: await verifyToken(accessToken, "access"), rotatedAccessToken: null };
    } catch {
      // Try refresh below.
    }
  }

  const refreshToken = request.cookies.get(refreshTokenName)?.value;
  if (!refreshToken) return null;

  try {
    const user = await verifyToken(refreshToken, "refresh");
    const rotatedAccessToken = await createAccessToken(user);
    return { user, rotatedAccessToken };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiAdmin = pathname.startsWith("/api/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute && !isApiAdmin) {
    return NextResponse.next();
  }

  const session = await resolveSession(request);

  if (isAdminLogin) {
    if (!session) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (session.rotatedAccessToken) {
      response.cookies.set(accessTokenName, session.rotatedAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: accessMaxAge,
      });
    }
    return response;
  }

  if (!session) {
    if (isApiAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  if (session.rotatedAccessToken) {
    response.cookies.set(accessTokenName, session.rotatedAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: accessMaxAge,
    });
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
