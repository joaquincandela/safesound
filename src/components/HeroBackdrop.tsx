"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FILM_MS = 6000;
const HANDOFF_MS = 620;

const slides = [
  { src: "/images/_DSC7076.JPG", width: 7008, height: 3944, alt: "" },
  { src: "/images/DSC01038.JPG", width: 6000, height: 3376, alt: "" },
  { src: "/images/EPICKVOID.JPG", width: 7008, height: 3944, alt: "" },
  { src: "/images/GRIDVOID.JPG", width: 6000, height: 3376, alt: "" },
  { src: "/images/DSC01119.JPG", width: 6000, height: 3376, alt: "" },
  { src: "/images/DSC01434.JPG", width: 6000, height: 3376, alt: "" },
  { src: "/images/PRODUCTOVOID.JPG", width: 6000, height: 3376, alt: "" },
];

export default function HeroBackdrop() {
  const [phase, setPhase] = useState<{ active: number; outgoing: number | null }>(
    { active: 0, outgoing: null }
  );
  const { active, outgoing } = phase;
  const total = slides.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const interval = window.setInterval(() => {
      if (paused) return;
      setPhase(({ active: current }) => ({
        active: (current + 1) % total,
        outgoing: current,
      }));
    }, FILM_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, [total]);

  useEffect(() => {
    if (outgoing === null) return;
    const timer = window.setTimeout(
      () => setPhase((current) => ({ ...current, outgoing: null })),
      HANDOFF_MS + 20
    );
    return () => window.clearTimeout(timer);
  }, [outgoing, active]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {slides.map((slide, position) => {
        const isActive = position === active;
        const isOutgoing = position === outgoing;

        return (
          <div
            key={slide.src}
            className={`absolute inset-0 ${
              isOutgoing ? "z-30 animate-film-out" : isActive ? "z-10" : "z-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={position === 0}
              sizes="100vw"
              quality={72}
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
