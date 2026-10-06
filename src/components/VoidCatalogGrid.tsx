"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { VoidVariant } from "../lib/void-catalog";
import {
  getVoidVariantImage,
  VOID_FALLBACK_IMAGE,
  VOID_PRICE_LABEL,
} from "../lib/void-catalog";

type Props = {
  selectedId: string;
  variants: VoidVariant[];
  brokenImages: Record<string, boolean>;
  onBrokenImage: (src: string) => void;
  onAddToCart: (variant: VoidVariant) => void;
};

export default function VoidCatalogGrid({
  selectedId,
  variants,
  brokenImages,
  onBrokenImage,
  onAddToCart,
}: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedId;
        const imageSrc = brokenImages[variant.imageSrc]
          ? VOID_FALLBACK_IMAGE
          : getVoidVariantImage(variant);

        return (
          <article
            key={variant.id}
            className={`overflow-hidden rounded-[1.8rem] border bg-white transition-all duration-300 ${
              isSelected
                ? "border-[#064DB7] shadow-[0_16px_40px_rgba(6,77,183,0.16)] ring-1 ring-[#064DB7]/20"
                : "border-[#DDD6D0] shadow-sm hover:-translate-y-1 hover:border-[#064DB7]/25 hover:shadow-xl"
            }`}
          >
            <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_top,#064DB714,transparent_42%),linear-gradient(180deg,#FCFBFA_0%,#F4F1EF_100%)]">
              <Image
                src={imageSrc}
                alt={variant.name}
                fill
                sizes="(min-width: 1280px) 18rem, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 hover:scale-[1.03]"
                onError={() => onBrokenImage(variant.imageSrc)}
              />
              <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#064DB7] backdrop-blur">
                {isSelected ? "Seleccionado" : "VOID"}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#252525]">
                    {variant.shortName}
                  </h3>
                  <p className="mt-1 text-sm text-[#6F6A66]">{variant.finish}</p>
                </div>
                <p className="text-lg font-black text-[#252525]">
                  {VOID_PRICE_LABEL}
                </p>
              </div>

              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#999]">
                Ref. {variant.reference}
              </p>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => onAddToCart(variant)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#064DB7] px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(6,77,183,0.28)]"
                >
                  <ShoppingCart size={16} />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
