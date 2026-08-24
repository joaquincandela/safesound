"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import {
  buildCartOrderWhatsAppMessage,
  formatSoles,
  useCart,
} from "../lib/cart-context";
import {
  getVoidVariantImage,
  VOID_FALLBACK_IMAGE,
  VOID_PRICE_LABEL,
  VOID_PRODUCT_NAME,
} from "../lib/void-catalog";

type Props = {
  whatsappNumber: string;
};

export default function CartDrawer({ whatsappNumber }: Props) {
  const {
    lines,
    totalQuantity,
    subtotal,
    isOpen,
    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleBrokenImage = (src: string) => {
    setBrokenImages((current) => ({ ...current, [src]: true }));
  };

  const handleCheckout = () => {
    if (lines.length === 0) return;
    const message = buildCartOrderWhatsAppMessage(lines, subtotal);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[90] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#DDD6D0] bg-[#F4F1EF] shadow-[0_0_80px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#DDD6D0] bg-white/80 px-5 py-5 backdrop-blur sm:px-6">
          <div>
            <h2 className="text-2xl font-black text-[#252525]">Tu carrito</h2>
            <p className="mt-1 text-sm text-[#6F6A66]">
              {totalQuantity > 0
                ? `${totalQuantity} ${totalQuantity === 1 ? "unidad" : "unidades"}`
                : "Todavía no agregas nada"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E1DC] bg-white text-[#555] transition hover:border-[#7B2CFF] hover:text-[#7B2CFF]"
          >
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7B2CFF]/8">
              <ShoppingCart size={28} className="text-[#7B2CFF]" />
            </div>
            <p className="mt-5 text-lg font-black text-[#252525]">
              Tu carrito está vacío
            </p>
            <p className="mt-2 text-sm text-[#6F6A66]">
              Elige tu acabado VOID favorito y agrégalo para armar tu pedido.
            </p>
            <a
              href="#catalogo"
              onClick={closeCart}
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#7B2CFF] px-6 py-3 font-bold text-[#7B2CFF] transition hover:bg-[#7B2CFF] hover:text-white"
            >
              Ver acabados
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
              {lines.map((line) => {
                const imageSrc = brokenImages[line.variant.imageSrc]
                  ? VOID_FALLBACK_IMAGE
                  : getVoidVariantImage(line.variant);

                return (
                  <div
                    key={line.variant.id}
                    className="relative rounded-[1.5rem] border border-[#DDD6D0] bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.1rem] border border-[#EEE7E2] bg-[radial-gradient(circle_at_top,#7B2CFF14,transparent_60%),linear-gradient(180deg,#FCFBFA_0%,#F4F1EF_100%)]">
                        <Image
                          src={imageSrc}
                          alt={line.variant.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={() => handleBrokenImage(line.variant.imageSrc)}
                        />
                      </div>

                      <div className="min-w-0 flex-1 pr-8">
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#7B2CFF]">
                          {VOID_PRODUCT_NAME}
                        </p>
                        <p className="truncate text-base font-black text-[#252525]">
                          {line.variant.shortName}
                        </p>
                        <p className="truncate text-xs text-[#6F6A66]">
                          {line.variant.finish} · {VOID_PRICE_LABEL}
                        </p>
                        <p className="mt-1.5 text-sm font-black text-[#252525]">
                          {VOID_PRICE_LABEL} × {line.quantity} ={" "}
                          {formatSoles(line.lineTotal)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-[#E8E1DC] bg-white">
                        <button
                          type="button"
                          aria-label={`Quitar una unidad de ${line.variant.name}`}
                          onClick={() => decrementItem(line.variant.id)}
                          disabled={line.quantity <= 1}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-[#555] transition ${
                            line.quantity <= 1
                              ? "cursor-not-allowed opacity-35"
                              : "hover:bg-[#F4F1EF] hover:text-[#7B2CFF]"
                          }`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-[#252525]">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Agregar una unidad de ${line.variant.name}`}
                          onClick={() => incrementItem(line.variant.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#555] transition hover:bg-[#F4F1EF] hover:text-[#7B2CFF]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(line.variant.id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#999] transition hover:text-red-500"
                      >
                        <Trash2 size={15} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#DDD6D0] bg-white/95 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:px-6">
              <div className="flex items-end justify-between gap-4">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#6F6A66]">
                  Subtotal
                </p>
                <p className="text-2xl font-black text-[#252525]">
                  {formatSoles(subtotal)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={lines.length === 0}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-black transition ${
                  lines.length === 0
                    ? "cursor-not-allowed bg-[#7B2CFF]/40 text-white/70"
                    : "bg-[#7B2CFF] text-white hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(123,44,255,0.28)]"
                }`}
              >
                <MessageCircle size={20} />
                Finalizar pedido por WhatsApp
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
