import { NextResponse } from "next/server";
import {
  appendMessage,
  getOrCreateConversation,
  normalizeVisitorId,
  sanitizeName,
  sanitizeText,
} from "../../../lib/chat-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const visitorId = normalizeVisitorId(searchParams.get("visitorId"));
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId inválido" }, { status: 400 });
  }

  const name = sanitizeName(searchParams.get("name"));
  const conversation = await getOrCreateConversation(visitorId, name || undefined);

  return NextResponse.json({
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      at: message.at,
      readByVisitor: message.readByVisitor,
    })),
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const data = body as { visitorId?: unknown; name?: unknown; text?: unknown };
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

  const name = sanitizeName(data.name);
  const conversation = await appendMessage(
    visitorId,
    "visitor",
    text,
    name || undefined
  );

  return NextResponse.json({
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      at: message.at,
    })),
  });
}
