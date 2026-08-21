import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-guard";
import {
  deleteConversation,
  listConversations,
  markThreadReadByAdmin,
  normalizeVisitorId,
} from "../../../../lib/chat-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const conversations = await listConversations();
  return NextResponse.json({
    conversations: conversations.map((conversation) => {
      const lastMessage = conversation.messages.at(-1);
      return {
        visitorId: conversation.visitorId,
        name: conversation.name || "Visitante",
        updatedAt: conversation.updatedAt,
        unreadCount: conversation.messages.filter(
          (message) => message.sender === "visitor" && !message.readByAdmin
        ).length,
        lastMessage: lastMessage
          ? {
              sender: lastMessage.sender,
              text: lastMessage.text,
              at: lastMessage.at,
            }
          : null,
      };
    }),
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

  const data = body as { visitorId?: unknown };
  const visitorId = normalizeVisitorId(data.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId inválido" }, { status: 400 });
  }

  await markThreadReadByAdmin(visitorId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

  await deleteConversation(visitorId);
  return NextResponse.json({ ok: true });
}
