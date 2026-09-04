"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, MessageCircle, Send, Sparkles, X } from "lucide-react";
import type { VoidVariant } from "../lib/void-catalog";
import { useKeyboardAwarePosition } from "../lib/use-keyboard-aware-position";

type ChatMessage = {
  id: string;
  sender: "visitor" | "admin";
  text: string;
  at: number;
};

type Props = {
  selectedVariant: VoidVariant;
  variants: VoidVariant[];
  onSelectVariant: (variant: VoidVariant) => void;
};

const VISITOR_ID_KEY = "safesound_chat_visitor_id";
const VISITOR_NAME_KEY = "safesound_chat_visitor_name";
const CHAT_OPEN_STATE_KEY = "safesound_chat_open";

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

export default function ChatWidget({
  selectedVariant,
  variants,
  onSelectVariant,
}: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const visitorIdRef = useRef("");
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const keyboard = useKeyboardAwarePosition();

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    setName(window.localStorage.getItem(VISITOR_NAME_KEY) ?? "");
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(CHAT_OPEN_STATE_KEY) !== "open") return;
    const visitorId = visitorIdRef.current || getVisitorId();
    setOpen(true);
    setUnreadCount(0);
    fetch("/api/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

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
    if (!open) return;
    const container = messagesScrollRef.current;
    if (container && stickToBottomRef.current) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open]);

  const handleOpen = () => {
    stickToBottomRef.current = true;
    setOpen(true);
    window.sessionStorage.setItem(CHAT_OPEN_STATE_KEY, "open");
    setUnreadCount(0);
    const visitorId = visitorIdRef.current || getVisitorId();
    fetch("/api/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    }).catch(() => undefined);
  };

  const handleClose = () => {
    setOpen(false);
    window.sessionStorage.setItem(CHAT_OPEN_STATE_KEY, "closed");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    window.localStorage.setItem(VISITOR_NAME_KEY, value);
  };

  const sendVisitorMessage = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText || sending) return false;

      const visitorId = visitorIdRef.current || getVisitorId();
      setSending(true);
      setSendError(false);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, name, text: cleanText }),
        });

        if (!response.ok) {
          setSendError(true);
          return false;
        }

        const data = (await response.json()) as { messages: ChatMessage[] };
        setMessages(data.messages);
        return true;
      } catch {
        setSendError(true);
        return false;
      } finally {
        setSending(false);
      }
    },
    [name, sending]
  );

  const handleSend = async () => {
    const ok = await sendVisitorMessage(draft);
    if (ok) setDraft("");
  };

  const handleSelectModel = async (variant: VoidVariant) => {
    onSelectVariant(variant);
    const ok = await sendVisitorMessage(`Quiero información sobre: ${variant.name}`);
    if (ok) {
      setSelectorOpen(false);
      setDraft("");
    }
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[60] flex h-[88dvh] touch-manipulation flex-col overflow-hidden rounded-t-[1.5rem] border border-b-0 border-[#DDD6D0] bg-white shadow-[0_-12px_60px_rgba(0,0,0,0.28)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[34rem] sm:max-w-[calc(100vw-3rem)] sm:rounded-[2rem] sm:border sm:border-b sm:shadow-[0_28px_80px_rgba(0,0,0,0.32)]"
          style={
            keyboard.enabled
              ? { top: keyboard.top, height: keyboard.height }
              : undefined
          }
        >
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
              onClick={handleClose}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition active:bg-white/20 hover:bg-white/10 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="border-b border-[#EEE7E2] bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectorOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-[#DDD6D0] bg-[#F8F5F2] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#252525] transition hover:border-[#7B2CFF] hover:text-[#7B2CFF]"
              >
                <Sparkles size={14} />
                Elegir modelo
              </button>
              <div className="min-w-0 rounded-full bg-[#7B2CFF]/8 px-3 py-2 text-xs text-[#7B2CFF]">
                <span className="block truncate font-black">{selectedVariant.shortName}</span>
                <span className="block truncate text-[11px] text-[#6F6A66]">
                  {selectedVariant.finish}
                </span>
              </div>
            </div>

            {selectorOpen ? (
              <div className="mt-3 grid max-h-[38dvh] gap-2 overflow-y-auto overscroll-contain pb-1 sm:max-h-none sm:grid-cols-2">
                {variants.map((variant) => {
                  const isSelected = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleSelectModel(variant)}
                      disabled={sending}
                      className={`rounded-2xl border px-3 py-3 text-left transition ${
                        isSelected
                          ? "border-[#7B2CFF] bg-[#7B2CFF]/8"
                          : "border-[#E8E1DC] bg-white hover:border-[#7B2CFF]/35 hover:bg-[#7B2CFF]/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {variant.swatches.map((swatch) => (
                            <span
                              key={`${variant.id}-${swatch}`}
                              className="h-3.5 w-3.5 rounded-full border border-black/10"
                              style={{ backgroundColor: swatch }}
                            />
                          ))}
                        </div>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            isSelected ? "bg-[#7B2CFF] text-white" : "bg-[#F4F1EF] text-[#AAA]"
                          }`}
                        >
                          <Check size={12} />
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-black text-[#252525]">
                        {variant.shortName}
                      </p>
                      <p className="mt-1 text-[11px] text-[#6F6A66]">{variant.finish}</p>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div
            ref={messagesScrollRef}
            onScroll={(event) => {
              const element = event.currentTarget;
              stickToBottomRef.current =
                element.scrollHeight - element.scrollTop - element.clientHeight <
                80;
            }}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#F4F1EF] px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="mt-8 text-center text-sm text-[#666]">
                Escríbenos y te respondemos lo antes posible.
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
                      message.sender === "visitor" ? "text-white/60" : "text-[#999]"
                    }`}
                  >
                    {formatTime(message.at)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EEE7E2] bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {sendError ? (
              <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                No se pudo enviar el mensaje. Revisa tu conexión e intenta de nuevo.
              </p>
            ) : null}
            <input
              type="text"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Tu nombre (opcional)"
              maxLength={60}
              className="mb-2 w-full rounded-full border border-[#DDD6D0] bg-white px-4 py-2.5 text-base text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
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
                className="w-full min-w-0 flex-1 rounded-full border border-[#DDD6D0] bg-white px-4 py-3 text-base text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
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
        onClick={() => (open ? handleClose() : handleOpen())}
        aria-label="Abrir chat de SafeSound"
        className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 touch-manipulation items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_35px_rgba(183,255,0,0.75)] transition active:scale-95 hover:scale-110 sm:bottom-6 sm:right-6"
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
