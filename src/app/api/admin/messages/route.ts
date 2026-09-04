import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-guard";
import {
  appendMessage,
  getOrCreateConversation,
  normalizeVisitorId,
  sanitizeText,
} from "../../../../lib/chat-store";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const visitorId = normalizeVisitorId(searchParams.get("visitorId"));
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId inválido" }, { status: 400 });
  }

  const conversation = await getOrCreateConversation(visitorId);
  return NextResponse.json({
    name: conversation.name || "Visitante",
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      at: message.at,
      readByAdmin: message.readByAdmin,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const data = body as { visitorId?: unknown; text?: unknown };
  const visitorId = normalizeVisitorId(data.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId inválido" }, { status: 400 });
  }

  const text = sanitizeText(data.text);
  if (!text) {
    return NextResponse.json(
      { error: "El mensaje no puede estar vacío" },
      { status: 400 }
    );
  }

  const conversation = await appendMessage(visitorId, "admin", text);
  return NextResponse.json({
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      at: message.at,
    })),
  });
}
