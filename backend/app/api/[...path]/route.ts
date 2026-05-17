import type { NextRequest } from "next/server";
import {
  createAdminSession,
  clearAdminCookies,
  getAdminAccessCookieName,
  getAdminCookieOptions,
  getAdminFromRequest,
  getAdminSessionFromCookies,
  verifyAdminCredentials,
} from "@/backend/auth";
import { errorResponse, jsonResponse, optionsResponse, parseRequestBody } from "@/backend/api";
import {
  inquirySchema,
  landSchema,
  landUpdateSchema,
  loginSchema,
  ownerSchema,
  soldSchema,
  testimonialSchema,
} from "@/backend/validators";
import { createInquiry, deleteInquiry, getInquiries, updateInquiry } from "@/backend/repositories/inquiries";
import { createLand, deleteLand, getLandById, getLands, updateLand } from "@/backend/repositories/lands";
import { getDashboardSummary } from "@/backend/repositories/summary";
import { createSoldRecord, deleteSoldRecord, getSoldRecords, updateSoldRecord } from "@/backend/repositories/sold";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "@/backend/repositories/testimonials";
import { getOwnerProfile, updateOwnerProfile } from "@/backend/repositories/owner";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

function getPath(parts: string[]) {
  return parts.join("/");
}

function zodMessage(error: { issues: Array<{ path: Array<string | number>; message: string }> }) {
  const issue = error.issues[0];
  if (!issue) return "Invalid payload";
  const field = issue.path[0];
  return field ? `${String(field)}: ${issue.message}` : issue.message;
}

function isAdminPath(path: string) {
  return path.startsWith("admin/");
}

async function requireAdmin(request: Request) {
  const user = await getAdminFromRequest(request);
  return user ? user : null;
}

async function handleAuth(request: NextRequest, path: string[]) {
  const route = getPath(path);

  if (route === "auth/login" && request.method === "POST") {
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

  if (route === "auth/me" && request.method === "GET") {
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

  if (route === "auth/refresh" && request.method === "POST") {
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

  if (route === "auth/logout" && request.method === "POST") {
    const response = jsonResponse({ ok: true }, 200);
    clearAdminCookies(response);
    return response;
  }

  return null;
}

async function handlePublicInquiries(request: NextRequest, path: string[]) {
  const route = getPath(path);
  if (route !== "inquiries") {
    return null;
  }

  if (request.method === "POST") {
    const body = await parseRequestBody<unknown>(request);
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid inquiry payload", 400);
    }
    return jsonResponse(await createInquiry(parsed.data), 201);
  }

  return errorResponse("Method not allowed", 405);
}

async function handleAdmin(request: NextRequest, path: string[]) {
  const route = getPath(path);
  const admin = await requireAdmin(request);
  if (!admin) {
    return errorResponse("Unauthorized", 401);
  }

  if (route === "admin/summary" && request.method === "GET") {
    return jsonResponse(await getDashboardSummary());
  }

  if (route === "admin/lands" && request.method === "GET") {
    return jsonResponse(await getLands());
  }

  if (route === "admin/lands" && request.method === "POST") {
    const body = await parseRequestBody<unknown>(request);
    const parsed = landSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(zodMessage(parsed.error), 400);
    }
    return jsonResponse(await createLand(parsed.data), 201);
  }

  if (route === "admin/sold" && request.method === "GET") {
    return jsonResponse(await getSoldRecords());
  }

  if (route === "admin/sold" && request.method === "POST") {
    const body = await parseRequestBody<unknown>(request);
    const parsed = soldSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid sold payload", 400);
    }
    return jsonResponse(await createSoldRecord(parsed.data), 201);
  }

  if (route === "admin/testimonials" && request.method === "GET") {
    return jsonResponse(await getTestimonials());
  }

  if (route === "admin/testimonials" && request.method === "POST") {
    const body = await parseRequestBody<unknown>(request);
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid testimonial payload", 400);
    }
    return jsonResponse(await createTestimonial(parsed.data), 201);
  }

  if (route === "admin/inquiries" && request.method === "GET") {
    return jsonResponse(await getInquiries());
  }

  if (route === "admin/inquiries" && request.method === "POST") {
    const body = await parseRequestBody<unknown>(request);
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid inquiry payload", 400);
    }
    return jsonResponse(await createInquiry(parsed.data), 201);
  }

  if (route === "admin/owner" && request.method === "GET") {
    return jsonResponse(await getOwnerProfile());
  }

  if (route === "admin/owner" && request.method === "PUT") {
    const body = await parseRequestBody<unknown>(request);
    const parsed = ownerSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid owner payload", 400);
    }
    return jsonResponse(await updateOwnerProfile(parsed.data));
  }

  const resource = path[1];
  const id = path[2];

  if (path.length === 3 && resource === "lands") {
    if (request.method === "GET") {
      const land = await getLandById(id);
      return land ? jsonResponse(land) : errorResponse("Land not found", 404);
    }

    if (request.method === "PUT") {
      const body = await parseRequestBody<unknown>(request);
      const parsed = landUpdateSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(zodMessage(parsed.error), 400);
      }
      const updated = await updateLand(id, parsed.data);
      return updated ? jsonResponse(updated) : errorResponse("Land not found", 404);
    }

    if (request.method === "DELETE") {
      await deleteLand(id);
      return jsonResponse({ ok: true });
    }
  }

  if (path.length === 3 && resource === "sold") {
    if (request.method === "PUT") {
      const body = await parseRequestBody<unknown>(request);
      const parsed = soldSchema.partial().safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.issues[0]?.message ?? "Invalid sold payload", 400);
      }
      const updated = await updateSoldRecord(id, parsed.data);
      return updated ? jsonResponse(updated) : errorResponse("Sold record not found", 404);
    }

    if (request.method === "DELETE") {
      await deleteSoldRecord(id);
      return jsonResponse({ ok: true });
    }
  }

  if (path.length === 3 && resource === "testimonials") {
    if (request.method === "PUT") {
      const body = await parseRequestBody<unknown>(request);
      const parsed = testimonialSchema.partial().safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.issues[0]?.message ?? "Invalid testimonial payload", 400);
      }
      const updated = await updateTestimonial(id, parsed.data);
      return updated ? jsonResponse(updated) : errorResponse("Testimonial not found", 404);
    }

    if (request.method === "DELETE") {
      await deleteTestimonial(id);
      return jsonResponse({ ok: true });
    }
  }

  if (path.length === 3 && resource === "inquiries") {
    if (request.method === "PUT") {
      const body = await parseRequestBody<unknown>(request);
      const parsed = inquirySchema.partial().safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.issues[0]?.message ?? "Invalid inquiry payload", 400);
      }
      const updated = await updateInquiry(id, parsed.data);
      return updated ? jsonResponse(updated) : errorResponse("Inquiry not found", 404);
    }

    if (request.method === "DELETE") {
      await deleteInquiry(id);
      return jsonResponse({ ok: true });
    }
  }

  return null;
}

async function handlePath(request: NextRequest, path: string[]) {
  const authResponse = await handleAuth(request, path);
  if (authResponse) return authResponse;

  const publicResponse = await handlePublicInquiries(request, path);
  if (publicResponse) return publicResponse;

  if (isAdminPath(getPath(path))) {
    const adminResponse = await handleAdmin(request, path);
    if (adminResponse) return adminResponse;
  }

  return errorResponse("Not found", 404);
}

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  return handlePath(request, (await params).path ?? []);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return handlePath(request, (await params).path ?? []);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return handlePath(request, (await params).path ?? []);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return handlePath(request, (await params).path ?? []);
}
