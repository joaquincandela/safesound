"use client";

import Image from "next/image";

const brands = [
  { src: "/images/WNS.jpeg", width: 967, height: 976, alt: "WNS" },
  { src: "/images/Piknic_Negro.png", width: 2376, height: 1080, alt: "Piknic" },
  { src: "/images/GRID.jpeg", width: 225, height: 225, alt: "GRID" },
  { src: "/images/EPICK.jpeg", width: 672, height: 455, alt: "EPICK" },
  { src: "/images/PIK.jpeg", width: 615, height: 620, alt: "PIK" },
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const loop = [...brands, ...brands];

  return (
    <div className="group flex overflow-hidden">
      <div
        className={`flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14 ${
          reverse ? "logo-track-reverse" : "logo-track"
        }`}
      >
        {loop.map((brand, index) => (
          <div
            key={`${brand.src}-${index}`}
            className="flex h-8 w-24 shrink-0 items-center justify-center sm:h-10 sm:w-28"
          >
            <Image
              src={brand.src}
              alt={brand.alt}
              width={brand.width}
              height={brand.height}
              loading="lazy"
              className="max-h-full max-w-full object-contain opacity-45 grayscale transition duration-500 group-hover:opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustedLogos() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-center text-xs font-bold uppercase tracking-[0.35em] text-[#064DB7]">
        Marcas con las que trabajamos
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
