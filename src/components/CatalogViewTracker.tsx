"use client";

import { useEffect } from "react";
import { trackPixel } from "../lib/meta-pixel";

// Avisa a Meta (evento ViewContent) cuando la persona realmente ve el catálogo
// (sección #catalogo). Así se mide cuántos de los que hacen clic en el anuncio
// llegan al catálogo y no se quedan arriba de la página.
export default function CatalogViewTracker() {
  useEffect(() => {
    const target = document.getElementById("catalogo");
    if (!target || typeof IntersectionObserver === "undefined") return;

    let sent = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // El pixel se carga después de que la página es interactiva: si aún no
    // existe, reintenta unos segundos antes de rendirse.
    const send = (attempt = 0) => {
      if (sent) return;
      if (typeof window.fbq === "function") {
        sent = true;
        trackPixel("ViewContent", {
          content_name: "Catalogo VOID",
          content_category: "catalogo",
        });
        return;
      }
      if (attempt < 20) timer = setTimeout(() => send(attempt + 1), 500);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          send();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
