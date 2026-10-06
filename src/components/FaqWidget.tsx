"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  MessageCircleQuestion,
  Send,
  X,
} from "lucide-react";

type Faq = {
  question: string;
  answer: string;
};

const waNumber = "51968255972";

const faqs: Faq[] = [
  {
    question: "¿Cuánto reducen el ruido?",
    answer:
      "Los earplugs VOID reducen hasta 23 dB, bajando el volumen agresivo sin aislarte por completo y manteniendo la claridad del sonido.",
  },
  {
    question: "¿Cuánto cuestan?",
    answer:
      "El precio único es S/ 65.00. Incluye los earplugs VOID, estuche portátil y 2 pares de tallas de repuesto.",
  },
  {
    question: "¿De qué material están hechos?",
    answer:
      "Están hechos de silicona médica hipoalergénica. Son reutilizables y lavables.",
  },
  {
    question: "¿Cómo los limpio?",
    answer:
      "Se lavan con agua tibia y jabón neutro. Déjalos secar al aire antes de guardarlos en su estuche.",
  },
  {
    question: "¿Para qué actividades sirven?",
    answer:
      "Sirven para conciertos y fiestas, trabajo y estudio, sueño, viajes y cualquier ambiente ruidoso. Reducen el ruido sin aislarte.",
  },
  {
    question: "¿Qué acabados están disponibles?",
    answer:
      "Hay 8 acabados: Black Gold, Yellow Gold, White Silver, Black Silver, White Purple, White Rose Gold, White Clear y Black Clear.",
  },
  {
    question: "¿Cómo hago mi pedido y el delivery?",
    answer:
      "La compra se coordina por WhatsApp. Escríbenos tu modelo y distrito para confirmar disponibilidad y entrega.",
  },
];

export default function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [doubt, setDoubt] = useState("");

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const openWhatsApp = (text: string) => {
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDoubt = () => {
    const clean = doubt.trim();
    openWhatsApp(
      clean
        ? `Hola SafeSound, tengo una duda:\n\n${clean}`
        : "Hola SafeSound, tengo una duda..."
    );
    setDoubt("");
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex h-[86dvh] touch-manipulation flex-col overflow-hidden rounded-t-[1.5rem] border border-b-0 border-[#DDD6D0] bg-white shadow-[0_-12px_60px_rgba(0,0,0,0.28)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[36rem] sm:max-w-[calc(100vw-3rem)] sm:w-[26rem] sm:rounded-[2rem] sm:border sm:border-b sm:shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
          <div className="flex items-center justify-between bg-[#252525] px-5 py-4">
            <div>
              <p className="font-black text-white">SafeSound · Ayuda</p>
              <p className="flex items-center gap-1.5 text-xs text-[#B7FF00]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#B7FF00]" />
                Respuesta automática
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar ayuda"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition active:bg-white/20 hover:bg-white/10 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#F4F1EF] px-4 py-4">
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#E0D6CE] bg-white p-4 text-sm text-[#555]">
              <CircleHelp size={20} className="mt-0.5 shrink-0 text-[#064DB7]" />
              <p>
                Estas son las preguntas frecuentes con respuesta automática. Si
                tu duda no aparece aquí, escribénosla y te redirigimos a
                WhatsApp.
              </p>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isExpanded = expanded === index;
                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-2xl border border-[#E0D6CE] bg-white transition"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(isExpanded ? null : index)
                      }
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="text-sm font-bold text-[#252525]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-[#777] transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-[#064DB7]" : ""
                        }`}
                      />
                    </button>
                    {isExpanded ? (
                      <div className="border-t border-[#F0EAE6] bg-[#FBF9F7] px-4 py-3 text-sm leading-relaxed text-[#555]">
                        {faq.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#EEE7E2] bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#064DB7]">
              <MessageCircleQuestion size={14} />
              ¿Otra duda?
            </p>
            <textarea
              value={doubt}
              onChange={(event) => setDoubt(event.target.value)}
              placeholder="Escribe tu pregunta..."
              rows={2}
              maxLength={600}
              className="w-full resize-none rounded-2xl border border-[#DDD6D0] bg-white px-4 py-3 text-base text-[#252525] outline-none transition placeholder:text-[#999] focus:border-[#064DB7] focus:ring-2 focus:ring-[#064DB7]/20"
            />
            <button
              type="button"
              onClick={handleDoubt}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-black text-white transition hover:scale-[1.02] hover:shadow-lg"
            >
              <Send size={16} />
              Responder por WhatsApp
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir preguntas frecuentes de SafeSound"
        className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 touch-manipulation items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_35px_rgba(183,255,0,0.75)] transition active:scale-95 hover:scale-110 sm:bottom-6 sm:right-6"
      >
        <MessageCircleQuestion size={30} />
      </button>
    </>
  );
}