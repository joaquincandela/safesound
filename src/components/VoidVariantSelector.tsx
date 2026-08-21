"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { VoidVariant } from "../lib/void-catalog";

type Props = {
  selectedId: string;
  variants: VoidVariant[];
  onSelect: (variant: VoidVariant) => void;
};

export default function VoidVariantSelector({
  selectedId,
  variants,
  onSelect,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedId) ?? variants[0],
    [selectedId, variants]
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 rounded-[1.35rem] border border-[#DDD6D0] bg-white px-4 py-4 text-left transition hover:border-[#7B2CFF]/35 hover:shadow-sm"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7B2CFF]">
            Modelo elegido
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              {selectedVariant.swatches.map((swatch) => (
                <span
                  key={`${selectedVariant.id}-${swatch}`}
                  className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#252525]">
                {selectedVariant.shortName}
              </p>
              <p className="truncate text-xs text-[#6F6A66]">
                {selectedVariant.finish}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E1DC] text-[#252525] transition ${
            isOpen ? "rotate-180 border-[#7B2CFF] text-[#7B2CFF]" : ""
          }`}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 rounded-[1.5rem] border border-[#DDD6D0] bg-white p-3 shadow-[0_18px_44px_rgba(37,37,37,0.12)]">
          <div
            role="listbox"
            aria-label="Selecciona tu acabado"
            className="grid max-h-[22rem] gap-2 overflow-y-auto pr-1"
          >
            {variants.map((variant) => {
              const isSelected = variant.id === selectedId;

              return (
                <button
                  key={variant.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelect(variant);
                    setIsOpen(false);
                  }}
                  className={`group flex items-center justify-between gap-3 rounded-[1.1rem] border px-3 py-3 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-[#7B2CFF] bg-[#7B2CFF]/8 ring-1 ring-[#7B2CFF]/15"
                      : "border-[#E8E1DC] bg-white hover:border-[#7B2CFF]/35 hover:bg-[#FCFAFF]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex items-center gap-2">
                      {variant.swatches.map((swatch) => (
                        <span
                          key={`${variant.id}-${swatch}`}
                          className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: swatch }}
                        />
                      ))}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#252525]">
                        {variant.shortName}
                      </p>
                      <p className="truncate text-xs text-[#6F6A66]">
                        {variant.finish}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? "border-[#7B2CFF] bg-[#7B2CFF] text-white"
                        : "border-[#DDD6D0] text-transparent group-hover:border-[#7B2CFF]/35"
                    }`}
                  >
                    <Check size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
