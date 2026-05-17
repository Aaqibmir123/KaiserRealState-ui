import bcrypt from "bcryptjs";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { site } from "@/constants/site";
import type { AdminAuthUser } from "@/types";

const accessTokenName = "kasier-admin-token";
const refreshTokenName = "kasier-admin-refresh";
const issuer = "kasierwebsitee";
const audience = "kasier-admin";
const accessMaxAge = 60 * 15;
const refreshMaxAge = 60 * 60 * 24 * 30;

function readLocalEnvValue(key: string) {
  const candidateFiles = [join(process.cwd(), ".env.local"), join(process.cwd(), ".env")];

  for (const filePath of candidateFiles) {
    if (!existsSync(filePath)) continue;

    const file = readFileSync(filePath, "utf8");
    const line = file
      .split(/\r?\n/)
      .find((entry) => entry.startsWith(`${key}=`));

    if (!line) continue;

    const value = line.slice(key.length + 1).trim();
    if (value) return value;
  }

  return null;
}

function readConfiguredValue(key: string, fallback: string) {
  const envValue = process.env[key]?.trim();
  if (envValue) return envValue;

  const fileValue = readLocalEnvValue(key)?.trim();
  if (fileValue) return fileValue;

  return fallback;
}

function readConfiguredList(key: string) {
  const raw = readLocalEnvValue(key) ?? process.env[key];
  if (!raw) return [];

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

const adminEmail = readConfiguredValue("ADMIN_EMAIL", site.email);
const adminPhone = readConfiguredValue("ADMIN_PHONE", "7889893844");
const adminPhoneAliases = [];

function secretKey() {
  return new TextEncoder().encode(readConfiguredValue("JWT_SECRET", "kasierwebsitee-secret-change-me"));
}

function normalizeIdentifier(value: string) {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, "");
  if (trimmed.includes("@")) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) {
    return trimmed;
  }

  return digits;
}

function allowedIdentifiers() {
  const phoneDigits = normalizeIdentifier(adminPhone);
  const phoneVariants = phoneDigits.startsWith("91") && phoneDigits.length > 10 ? [phoneDigits, phoneDigits.slice(-10)] : [phoneDigits];
  const aliasVariants = adminPhoneAliases.flatMap((phone) => {
    const digits = normalizeIdentifier(phone);
    if (!digits) return [];
    return digits.startsWith("91") && digits.length > 10 ? [digits, digits.slice(-10)] : [digits];
  });

  return [normalizeIdentifier(adminEmail), ...phoneVariants, ...aliasVariants];
}

function passwordHash() {
  return readLocalEnvValue("ADMIN_PASSWORD_HASH")?.trim() || process.env.ADMIN_PASSWORD_HASH?.trim() || "";
}

export async function createAdminAccessToken(user: AdminAuthUser) {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${accessMaxAge}s`)
    .sign(secretKey());
}

export async function createAdminRefreshToken(user: AdminAuthUser) {
  return new SignJWT({ email: user.email, name: user.name, kind: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${refreshMaxAge}s`)
    .sign(secretKey());
}

export async function createAdminSession(user: AdminAuthUser) {
  const [accessToken, refreshToken] = await Promise.all([
    createAdminAccessToken(user),
    createAdminRefreshToken(user),
  ]);

  return { accessToken, refreshToken };
}

export async function verifyAdminAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey(), {
    issuer,
    audience,
  });

  return {
    id: payload.sub ?? "admin",
    email: String(payload.email ?? ""),
    name: String(payload.name ?? site.ownerName),
  } satisfies AdminAuthUser;
}

export async function verifyAdminRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey(), {
    issuer,
    audience,
  });

  return {
    id: payload.sub ?? "admin",
    email: String(payload.email ?? ""),
    name: String(payload.name ?? site.ownerName),
  } satisfies AdminAuthUser;
}

export async function verifyAdminCredentials(identifier: string, password: string) {
  const normalizedIdentifier = normalizeIdentifier(identifier);

  if (!allowedIdentifiers().includes(normalizedIdentifier)) {
    return null;
  }

  if (!process.env.ADMIN_PASSWORD_HASH) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, passwordHash());
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: "admin",
    email: adminEmail,
    name: site.ownerName,
  } satisfies AdminAuthUser;
}

export async function getAdminAccessTokenFromCookieStore() {
  const cookieStore = await cookies();
  return cookieStore.get(accessTokenName)?.value ?? null;
}

export async function getAdminRefreshTokenFromCookieStore() {
  const cookieStore = await cookies();
  return cookieStore.get(refreshTokenName)?.value ?? null;
}

export async function getAdminFromRequest(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const accessToken = cookieHeader.match(/kasier-admin-token=([^;]+)/)?.[1] ?? null;

  if (accessToken) {
    try {
      return await verifyAdminAccessToken(accessToken);
    } catch {
      // Try refresh below.
    }
  }

  const refreshToken = cookieHeader.match(/kasier-admin-refresh=([^;]+)/)?.[1] ?? null;
  if (!refreshToken) return null;

  try {
    return await verifyAdminRefreshToken(refreshToken);
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies() {
  const accessToken = await getAdminAccessTokenFromCookieStore();
  if (accessToken) {
    try {
      return { user: await verifyAdminAccessToken(accessToken), rotatedAccessToken: null };
    } catch {
      // Fall through to refresh token.
    }
  }

  const refreshToken = await getAdminRefreshTokenFromCookieStore();
  if (!refreshToken) {
    return null;
  }

  try {
    const user = await verifyAdminRefreshToken(refreshToken);
    const rotatedAccessToken = await createAdminAccessToken(user);
    return { user, rotatedAccessToken };
  } catch {
    return null;
  }
}

export function getAdminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function getAdminAccessCookieName() {
  return accessTokenName;
}

export function getAdminRefreshCookieName() {
  return refreshTokenName;
}

export function clearAdminCookies(response: { cookies: { delete(name: string): void } }) {
  response.cookies.delete(accessTokenName);
  response.cookies.delete(refreshTokenName);
}

