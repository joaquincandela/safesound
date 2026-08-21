import { NextResponse } from "next/server";
import {
  markThreadReadByVisitor,
  normalizeVisitorId,
} from "../../../../lib/chat-store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const data = body as { visitorId?: unknown };
  const visitorId = normalizeVisitorId(data.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId inválido" }, { status: 400 });
  }

  await markThreadReadByVisitor(visitorId);
  return NextResponse.json({ ok: true });
}
