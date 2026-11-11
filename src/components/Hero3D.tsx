"use client";
/* Inicio en 3D: una escena fija de 4 pantallas de scroll.
   Lo que se ve antes de que cargue el 3D (foto, textos, botón) se sirve desde el servidor. */
import { useEffect, useRef, useState } from "react";
import { FINISHES } from "../lib/void3d";
import type { Stage } from "../lib/void3d";

const PRECIO = 65;
const TEXTS = [
  { k: 1, h: "Mute the noise.\nFeel the moment.", s: "Earplugs de silicona médica. 14 acabados." },
  { k: 2, h: "Protege tus oídos.\nSigue disfrutando.", s: "Reducen el ruido sin aislarte." },
  { k: 3, h: "Gíralo. Tócalo.\nElige tu color.", s: "Silicona médica, tapa de metal, 3 tallas en la caja." },
  { k: 4, h: "14 acabados.\nUn solo precio.", s: "Desliza de lado para recorrerlos." },
  { k: 5, h: "Se ve como parte\nde tu look.", s: "Delivery gratis en distritos seleccionados de Lima." },
];

export default function Hero3D() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const [sel, setSel] = useState("bs");
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const selRef = useRef(sel);
  selRef.current = sel;

  useEffect(() => {
    const el = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) el.classList.add("st-static");

    /* Progreso de scroll → escena. */
    let pending = false, p = reduced ? 0.5 : 0;
    const update = () => {
      pending = false;
      if (!reduced) {
        const r = el.getBoundingClientRect();
        p = Math.max(0, Math.min(1, -r.top / (r.height - window.innerHeight)));
      }
      const phase = p < 0.15 ? 1 : p < 0.35 ? 2 : p < 0.6 ? 3 : p < 0.8 ? 4 : 5;
      el.dataset.scene = String(phase);
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--s5", Math.max(0, Math.min(1, (p - 0.8) / 0.12)).toFixed(3));
      document.documentElement.classList.toggle("st-pinned", p < 0.98 && el.getBoundingClientRect().top <= 0);
      stageRef.current?.setProgress(p);
    };
    const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    /* Pausa el 3D fuera de pantalla. */
    const io = new IntersectionObserver((es) => stageRef.current?.setVisible(es[0].isIntersecting), { threshold: 0.05 });
    io.observe(el);

    /* Selección hecha desde el catálogo de abajo. */
    const onPageSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!id || id === selRef.current) return;
      setSel(id);
      stageRef.current?.select(id);
    };
    window.addEventListener("void:select", onPageSelect);

    /* Carga el 3D después del primer pintado. */
    let cancelled = false;
    const start = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) { setFallback(true); return; }
      const ua = navigator.userAgent;
      const cores = navigator.hardwareConcurrency || 4;
      const quality = !/Android|iPhone/.test(ua) && cores >= 6 ? "hi" : "lo";
      try {
        const mod = await import("../lib/void3d");
        if (cancelled) return;
        const stage = mod.createStage(canvas, {
          quality,
          initial: selRef.current,
          earImage: { w: 720, h: 900, u: 0.493, v: 0.515, px: 0.62, py: 0.45 },
          onSelect: (id) => {
            setSel(id);
            window.dispatchEvent(new CustomEvent("void:select3d", { detail: id }));
          },
          onFallback: () => { setFallback(true); stageRef.current?.dispose(); stageRef.current = null; },
        });
        stageRef.current = stage;
        stage.setProgress(p);
        requestAnimationFrame(() => { stage.resize(); setReady(true); });
      } catch { setFallback(true); }
    };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (document.readyState === "complete") { if (idle) idle(start, { timeout: 1500 }); else setTimeout(start, 200); }
    else window.addEventListener("load", () => { if (idle) idle(start, { timeout: 1500 }); else setTimeout(start, 200); }, { once: true });

    const onResize = () => stageRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("void:select", onPageSelect);
      io.disconnect();
      stageRef.current?.dispose();
      document.documentElement.classList.remove("st-pinned");
    };
  }, []);

  const pick = (id: string) => {
    setSel(id);
    stageRef.current?.select(id);
    window.dispatchEvent(new CustomEvent("void:select3d", { detail: id }));
  };
  const goPick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = root.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + 0.45 * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };
  const cur = FINISHES.find((f) => f.id === sel) || FINISHES[0];

  return (
    <section ref={root} className={"st" + (ready ? " st-ready" : "") + (fallback ? " st-fallback" : "")} data-scene="1" aria-label="VOID en 3D">
      <div className="st-pin">
        <img className="st-ear" src="/assets/oido-2.jpg" alt="" aria-hidden="true" />
        <div className="st-big" aria-hidden="true">VOID</div>
        <img className="st-poster" src="/assets/foto-roca.jpg" alt="Earplugs VOID sobre una roca negra" />
        <canvas ref={canvasRef} className="st-c" aria-label="VOID en 3D: arrastra para girarlo" />
        <div className="st-ui">
          <div className="st-txt">
            {TEXTS.map((t) => (
              <div key={t.k} className={"st-t st-t" + t.k}>
                <h1 className="st-h">{t.h.split("\n").map((l, i) => (<span key={i}>{l}<br /></span>))}</h1>
                <p className="st-s">{t.s}</p>
              </div>
            ))}
          </div>
          <div className="st-dots" role="group" aria-label="Elegir acabado">
            {FINISHES.map((f) => (
              <button key={f.id} type="button" className={"st-dot" + (f.id === sel ? " on" : "")} aria-pressed={f.id === sel} aria-label={f.name} onClick={() => pick(f.id)}
                style={{ background: `linear-gradient(90deg, ${f.dome} 50%, ${f.cap} 50%)` }} />
            ))}
          </div>
          <div className="st-bar">
            <div className="st-price">
              <span className="st-name">{cur.name}</span>
              <span><s className="was">S/ 80</s> S/ {PRECIO} · 2 pares S/ 120</span>
            </div>
            <a className="btn st-cta st-cta-pick" href="#catalogo" onClick={goPick}>Elegir mi color</a>
            <a className="btn wa st-cta st-cta-buy" href="#catalogo" target="_blank" rel="noopener">Pedir por WhatsApp</a>
          </div>
        </div>
        <p className="st-hint" aria-hidden="true">Desliza</p>
      </div>
    </section>
  );
}
