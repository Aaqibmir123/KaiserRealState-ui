import { NextResponse } from "next/server";

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": frontendOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    Vary: "Origin",
  };
}

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders() });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders() });
}

export async function parseRequestBody<T>(request: Request) {
  return (await request.json()) as T;
}

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
