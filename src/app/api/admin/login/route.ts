import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  isHttpsRequest,
  verifyCredentials,
} from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const data = body as { email?: unknown; password?: unknown };
  if (!verifyCredentials(data.email, data.password)) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest(request),
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
