"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "visitor" | "admin";
  text: string;
  at: number;
};

const VISITOR_ID_KEY = "safesound_chat_visitor_id";
const VISITOR_NAME_KEY = "safesound_chat_visitor_name";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let visitorId = window.localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const visitorIdRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    setName(window.localStorage.getItem(VISITOR_NAME_KEY) ?? "");
  }, []);

  const fetchMessages = useCallback(async () => {
    const visitorId = visitorIdRef.current || getVisitorId();
    if (!visitorId) return;

    try {
      const query = new URLSearchParams({ visitorId });
      if (name) query.set("name", name);
      const response = await fetch(`/api/chat?${query.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) return;

      const data = (await response.json()) as {
        messages: (ChatMessage & { readByVisitor?: boolean })[];
      };
      setMessages(data.messages);

      if (!open) {
        setUnreadCount(
          data.messages.filter(
            (message) => message.sender === "admin" && !message.readByVisitor
          ).length
        );
      }
    } catch {
      // Sin conexión: se reintenta en el siguiente ciclo.
    }
  }, [name, open]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, open ? 3000 : 10000);
    return () => clearInterval(interval);
  }, [fetchMessages, open]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
    const visitorId = visitorIdRef.current || getVisitorId();
    fetch("/api/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    }).catch(() => undefined);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    window.localStorage.setItem(VISITOR_NAME_KEY, value);
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const visitorId = visitorIdRef.current || getVisitorId();
    setSending(true);
    setDraft("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, name, text }),
      });

      if (response.ok) {
        const data = (await response.json()) as { messages: ChatMessage[] };
        setMessages(data.messages);
      }
    } catch {
      // Se reintenta con el próximo envío.
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open ? (
        <div className="fixed bottom-6 right-6 z-[60] flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[2rem] border border-[#DDD6D0] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
          <div className="flex items-center justify-between bg-[#252525] px-5 py-4">
            <div>
              <p className="font-black text-white">SafeSound</p>
              <p className="flex items-center gap-1.5 text-xs text-[#B7FF00]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#B7FF00]" />
                En línea
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar chat"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F4F1EF] px-4 py-4">
            {messages.length === 0 ? (
              <div className="mt-8 text-center text-sm text-[#666]">
                ¡Hola! 👋 Escríbenos y te respondemos lo antes posible.
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "visitor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    message.sender === "visitor"
                      ? "rounded-br-md bg-[#7B2CFF] text-white"
                      : "rounded-bl-md border border-[#DDD6D0] bg-white text-[#252525]"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-right text-[10px] ${
                      message.sender === "visitor"
                        ? "text-white/60"
                        : "text-[#999]"
                    }`}
                  >
                    {formatTime(message.at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#EEE7E2] bg-white px-4 py-3">
            <input
              type="text"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Tu nombre (opcional)"
              maxLength={60}
              className="mb-2 w-full rounded-full border border-[#DDD6D0] bg-white px-4 py-2 text-sm text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSend();
                }}
                placeholder="Escribe tu mensaje..."
                maxLength={1000}
                className="w-full rounded-full border border-[#DDD6D0] bg-white px-4 py-2.5 text-sm text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
              />
              <button
                type="button"
                aria-label="Enviar mensaje"
                onClick={handleSend}
                disabled={!draft.trim() || sending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_18px_rgba(183,255,0,0.5)] transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-label="Abrir chat de SafeSound"
        className="fixed bottom-6 right-6 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_35px_rgba(183,255,0,0.75)] transition hover:scale-110"
      >
        <MessageCircle size={30} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#7B2CFF] px-1.5 text-xs font-black text-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>
    </>
  );
}
