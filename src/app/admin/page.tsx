"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, RefreshCw, Send, ShieldCheck } from "lucide-react";

type AdminMessage = {
  id: string;
  sender: "visitor" | "admin";
  text: string;
  at: number;
};

type ConversationSummary = {
  visitorId: string;
  name: string;
  updatedAt: number;
  unreadCount: number;
  lastMessage: { sender: string; text: string; at: number } | null;
};

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [threadName, setThreadName] = useState("Visitante");
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState(false);

  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/conversations", { cache: "no-store" })
      .then((response) => setAuthenticated(response.ok))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/conversations", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = (await response.json()) as {
        conversations: ConversationSummary[];
      };
      setConversations(data.conversations);

      if (!selectedIdRef.current && data.conversations.length > 0) {
        setSelectedId(data.conversations[0].visitorId);
      }
    } catch {
      // Se reintenta en el siguiente ciclo.
    }
  }, []);

  const refreshThread = useCallback(async () => {
    const visitorId = selectedIdRef.current;
    if (!visitorId) return;

    try {
      const response = await fetch(
        `/api/admin/messages?visitorId=${encodeURIComponent(visitorId)}`,
        { cache: "no-store" }
      );
      if (!response.ok) return;

      const data = (await response.json()) as {
        name: string;
        messages: AdminMessage[];
      };
      setThreadName(data.name);
      setMessages(data.messages);

      const hasUnreadVisitorMessages = data.messages.some(
        (message) => message.sender === "visitor"
      );
      if (hasUnreadVisitorMessages) {
        fetch("/api/admin/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        }).catch(() => undefined);
      }
    } catch {
      // Se reintenta en el siguiente ciclo.
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    refreshConversations();
    const interval = setInterval(refreshConversations, 4000);
    return () => clearInterval(interval);
  }, [authenticated, refreshConversations]);

  useEffect(() => {
    if (!authenticated || !selectedId) return;
    refreshThread();
    const interval = setInterval(refreshThread, 2500);
    return () => clearInterval(interval);
  }, [authenticated, selectedId, refreshThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setAuthenticated(true);
        setPassword("");
      } else {
        setLoginError("Usuario o contraseña incorrectos.");
      }
    } catch {
      setLoginError("No se pudo conectar con el servidor.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    setAuthenticated(false);
    setConversations([]);
    setSelectedId(null);
    setMessages([]);
  };

  const handleReply = async () => {
    const text = draft.trim();
    if (!text || !selectedId || sending) return;

    setSending(true);
    setReplyError(false);

    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: selectedId, text }),
      });
      if (response.ok) {
        setDraft("");
        await refreshThread();
        await refreshConversations();
      } else {
        setReplyError(true);
      }
    } catch {
      setReplyError(true);
    } finally {
      setSending(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F1EF]">
        <p className="text-[#666]">Cargando...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#F4F1EF] px-4 py-8 text-[#252525] sm:px-6">
        <form
          onSubmit={handleLogin}
          className="mx-auto w-full max-w-sm rounded-[2rem] border border-[#DDD6D0] bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.12)] sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_20px_rgba(183,255,0,0.5)] sm:h-12 sm:w-12">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black sm:text-xl">SafeSound Admin</h1>
              <p className="text-xs tracking-widest text-[#7B2CFF]">
                PANEL PRIVADO
              </p>
            </div>
          </div>

          <label className="block text-sm font-bold text-[#252525]">
            Correo
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-[#DDD6D0] bg-white px-4 py-3 text-sm font-normal text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
              placeholder="admin@safesound.com"
            />
          </label>

          <label className="mt-4 block text-sm font-bold text-[#252525]">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-[#DDD6D0] bg-white px-4 py-3 text-sm font-normal text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
              placeholder="••••••••"
            />
          </label>

          {loginError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {loginError}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[#7B2CFF] py-3.5 font-black text-white transition hover:scale-[1.02]"
          >
            Iniciar sesión
          </button>

          <Link
            href="/"
            className="mt-4 block text-center text-sm text-[#666] transition hover:text-[#7B2CFF]"
          >
            ← Volver a la tienda
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F1EF] text-[#252525]">
      <header className="border-b border-[#DDD6D0] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-lg font-black sm:text-xl">
              SAFE<span className="text-[#B7FF00] bg-[#252525] rounded px-1">SOUND</span>{" "}
              · Chat
            </h1>
            <p className="text-xs tracking-[0.35em] text-[#7B2CFF]">
              PANEL DE ADMINISTRADOR
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-fit items-center gap-2 self-start rounded-full border border-[#DDD6D0] px-5 py-2.5 text-sm font-bold text-[#555] transition hover:border-red-300 hover:text-red-500 sm:self-auto"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:gap-6 md:py-8 lg:grid-cols-[22rem_1fr] lg:px-6">
        <aside
          className={`${
            selectedId ? "hidden lg:block" : "block"
          } max-h-[70dvh] overflow-y-auto rounded-[2rem] border border-[#DDD6D0] bg-white p-3 sm:p-4`}
        >
          <h2 className="px-2 pb-3 pt-1 text-sm font-black uppercase tracking-widest text-[#999]">
            Conversaciones ({conversations.length})
          </h2>

          {conversations.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-[#666]">
              Aún no hay mensajes de visitantes.
            </p>
          ) : null}

          <ul className="space-y-2">
            {conversations.map((conversation) => {
              const isActive = conversation.visitorId === selectedId;
              return (
                <li key={conversation.visitorId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(conversation.visitorId)}
                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-[#7B2CFF]/10 ring-1 ring-inset ring-[#7B2CFF]/40"
                        : "hover:bg-[#F4F1EF]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold text-[#252525]">
                        {conversation.name}
                      </span>
                      {conversation.unreadCount > 0 ? (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#7B2CFF] px-1.5 text-[11px] font-black text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-[#666]">
                      {conversation.lastMessage
                        ? `${
                            conversation.lastMessage.sender === "admin"
                              ? "Tú: "
                              : ""
                          }${conversation.lastMessage.text}`
                        : "Sin mensajes"}
                    </p>
                    <p className="mt-1 text-xs text-[#999]">
                      {conversation.lastMessage
                        ? formatTime(conversation.lastMessage.at)
                        : ""}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section
          className={`${
            selectedId ? "flex" : "hidden lg:flex"
          } h-[75dvh] min-h-[28rem] flex-col overflow-hidden rounded-[2rem] border border-[#DDD6D0] bg-white lg:h-auto lg:max-h-[70dvh] lg:min-h-[32rem]`}
        >
          {selectedId ? (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-[#EEE7E2] px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label="Volver a conversaciones"
                    onClick={() => setSelectedId(null)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#555] transition hover:bg-[#F4F1EF] hover:text-[#7B2CFF] lg:hidden"
                  >
                    ←
                  </button>
                  <div className="min-w-0">
                    <p className="truncate font-black text-[#252525]">
                      {threadName}
                    </p>
                    <p className="truncate text-xs text-[#999]">{selectedId}</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Actualizar conversación"
                  onClick={() => {
                    refreshThread();
                    refreshConversations();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#555] transition hover:bg-[#F4F1EF] hover:text-[#7B2CFF]"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-[#F4F1EF] px-4 py-5 sm:px-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        message.sender === "admin"
                          ? "rounded-br-md bg-[#7B2CFF] text-white"
                          : "rounded-bl-md border border-[#DDD6D0] bg-white text-[#252525]"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`mt-1 text-right text-[10px] ${
                          message.sender === "admin"
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

              <div className="border-t border-[#EEE7E2] px-4 py-4 sm:px-6">
                {replyError ? (
                  <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    No se pudo enviar la respuesta. Intenta de nuevo.
                  </p>
                ) : null}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleReply();
                    }}
                    placeholder="Responder como SafeSound..."
                    maxLength={1000}
                    className="w-full rounded-full border border-[#DDD6D0] bg-white px-5 py-3 text-sm text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#7B2CFF]"
                  />
                  <button
                    type="button"
                    aria-label="Enviar respuesta"
                    onClick={handleReply}
                    disabled={!draft.trim() || sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_18px_rgba(183,255,0,0.5)] transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-center text-[#666]">
              Selecciona una conversación para empezar a responder.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
