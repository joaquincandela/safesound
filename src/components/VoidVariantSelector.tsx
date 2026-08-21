"use client";

import { Check } from "lucide-react";
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
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedId;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant)}
            aria-pressed={isSelected}
            className={`group rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-300 ${
              isSelected
                ? "border-[#7B2CFF] bg-[#7B2CFF]/8 shadow-[0_10px_30px_rgba(123,44,255,0.14)] ring-1 ring-[#7B2CFF]/20"
                : "border-[#E8E1DC] bg-white hover:-translate-y-0.5 hover:border-[#7B2CFF]/35 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {variant.swatches.map((swatch) => (
                  <span
                    key={`${variant.id}-${swatch}`}
                    className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>

              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                  isSelected
                    ? "border-[#7B2CFF] bg-[#7B2CFF] text-white"
                    : "border-[#DDD6D0] text-transparent group-hover:border-[#7B2CFF]/35"
                }`}
              >
                <Check size={14} />
              </span>
            </div>

            <p className="mt-4 text-sm font-black text-[#252525]">
              {variant.shortName}
            </p>
            <p className="mt-1 text-xs text-[#6F6A66]">{variant.finish}</p>
          </button>
        );
      })}
    </div>
  );
}
