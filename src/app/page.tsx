"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Volume2,
  Briefcase,
  Moon,
  Star,
  Building2,
  HeartPulse,
  ShieldCheck,
  Feather,
  RefreshCw,
  Cross,
} from "lucide-react";

const wa = "https://wa.me/51968255972";
const instagram =
  "https://www.instagram.com/safesound.pe?igsh=MTFtMnI2ZXNwdms5Zg%3D%3D&utm_source=qr";

const sectionImageClass =
  "relative z-10 w-full rounded-[2rem] border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.32)]";

const benefitCards = [
  {
    icon: Volume2,
    title: "Conciertos & fiestas",
    text: "Reduce el volumen agresivo manteniendo la experiencia.",
    backgroundImage: "/images/eventos.ear.png",
  },
  {
    icon: Briefcase,
    title: "Trabajo & estudio",
    text: "Más enfoque y menos distracciones en tu día.",
  },
  {
    icon: Moon,
    title: "Sueño & viajes",
    text: "Descansa mejor y viaja con tranquilidad.",
  },
];

const benefitBarItems = [
  { icon: Volume2, title: "Reduce el ruido", text: "sin aislarte" },
  { icon: ShieldCheck, title: "Sonido claro", text: "menos saturación" },
  { icon: Feather, title: "Cómodos", text: "todo el día" },
  { icon: RefreshCw, title: "Reutilizables", text: "y lavables" },
  { icon: Cross, title: "Silicona médica", text: "hipoalergénica" },
];

const reviews = [
  {
    name: "Andrea",
    age: 24,
    context: "Diseñadora gráfica",
    quote: "Los usé en un festival y me sorprendió lo cómodos que son.",
  },
  {
    name: "Diego",
    age: 21,
    context: "Estudiante universitario",
    quote: "Ahora puedo estudiar en cafeterías sin distraerme tanto.",
  },
  {
    name: "Camila",
    age: 29,
    context: "Arquitecta",
    quote: "En vuelos largos me ayudan muchísimo a descansar mejor.",
  },
];

const includedItems = [
  {
    icon: ShieldCheck,
    title: "Earplugs premium",
  },
  {
    icon: Cross,
    title: "Estuche portátil",
  },
  {
    icon: RefreshCw,
    title: "Tallas de repuesto",
  },
];

type ProductSlide = {
  alt: string;
  caption: string;
  src: string;
};

const productSlides: ProductSlide[] = [
  {
    src: "/images/mute-case-hd.png",
    alt: "Estuche Mute con los earplugs en su interior",
    caption: "Estuche premium",
  },
  {
    src: "/images/publicmute.png",
    alt: "Detalle frontal de los earplugs SafeSound",
    caption: "Vista del producto",
  },
  {
    src: "/images/product-lifestyle.png",
    alt: "Producto SafeSound en una composición lifestyle",
    caption: "Lifestyle premium",
  },
];

export default function SafeSound() {
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [brokenSlides, setBrokenSlides] = useState<Record<string, boolean>>({});

  const currentProductSlide = productSlides[activeProductSlide];
  const isCurrentSlideBroken = Boolean(brokenSlides[currentProductSlide.src]);

  const goToPreviousSlide = () => {
    setActiveProductSlide((current) =>
      current === 0 ? productSlides.length - 1 : current - 1
    );
  };

  const goToNextSlide = () => {
    setActiveProductSlide((current) =>
      current === productSlides.length - 1 ? 0 : current + 1
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F1EF] text-[#252525]">
      <header className="sticky top-0 z-50 border-b border-[#DDD6D0] bg-[#F4F1EF]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              SAFE<span className="text-[#B7FF00]">SOUND</span>
            </h1>
            <p className="text-xs tracking-[0.45em] text-[#7B2CFF]">
              MUTE THE NOISE
            </p>
          </div>

          <nav className="hidden gap-10 font-semibold text-[#555] md:flex">
            <a href="#mute" className="transition hover:text-[#7B2CFF]">
              VOID
            </a>
            <a href="#empresas" className="transition hover:text-[#7B2CFF]">
              Empresas
            </a>
            <a href="#healthy" className="transition hover:text-[#7B2CFF]">
              Healthy Sound
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp SafeSound"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_25px_rgba(183,255,0,0.45)] transition hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.11 17.21c-.29-.15-1.69-.84-1.95-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.08-.29-.15-1.2-.44-2.29-1.39-.85-.76-1.42-1.69-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.08-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43 0 1.43 1.03 2.81 1.17 3 .15.19 2.02 3.08 4.89 4.32.68.29 1.21.47 1.62.6.68.22 1.31.19 1.8.12.55-.08 1.69-.69 1.93-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33Z" />
                <path d="M16.01 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.45 1.7 6.38L3.2 28.8l6.62-1.7a12.7 12.7 0 0 0 6.19 1.58h.01c7.05 0 12.78-5.72 12.78-12.77S23.06 3.2 16.01 3.2Zm0 23.42h-.01a10.6 10.6 0 0 1-5.41-1.49l-.39-.23-3.93 1.01 1.05-3.84-.25-.4a10.58 10.58 0 0 1-1.63-5.66c0-5.85 4.76-10.61 10.61-10.61 2.84 0 5.5 1.1 7.5 3.1a10.52 10.52 0 0 1 3.11 7.51c0 5.85-4.76 10.61-10.61 10.61Z" />
              </svg>
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram SafeSound"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DDD6D0] bg-white text-[#7B2CFF] shadow-sm transition hover:scale-105 hover:border-[#7B2CFF] hover:shadow-[0_0_24px_rgba(123,44,255,0.18)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.36 1.72H7.89A4.17 4.17 0 0 0 3.72 7.89v8.22a4.17 4.17 0 0 0 4.17 4.17h8.22a4.17 4.17 0 0 0 4.17-4.17V7.89a4.17 4.17 0 0 0-4.17-4.17Zm-4.11 3.64A4.64 4.64 0 1 1 7.36 12 4.64 4.64 0 0 1 12 7.36Zm0 1.72A2.92 2.92 0 1 0 14.92 12 2.92 2.92 0 0 0 12 9.08Zm4.83-2.02a1.11 1.11 0 1 1-1.11 1.11 1.11 1.11 0 0 1 1.11-1.11Z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <section
        id="mute"
        className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#7B2CFF22,transparent_25%),radial-gradient(circle_at_80%_30%,#B7FF0022,transparent_25%)]" />

        <div>
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#7B2CFF]">
            <Volume2 size={20} />
            Protección auditiva premium
          </div>

          <h1 className="mt-6 text-7xl font-black tracking-tight leading-none text-[#252525] md:text-8xl lg:text-9xl">
            V O I D
          </h1>

          <div className="mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#7B2CFF]/70 to-transparent" />

          <p className="mt-6 max-w-xl text-xl leading-relaxed text-[#555]">
            Earplugs premium diseñados para reducir el ruido sin aislarte.
            Diseñados para conciertos, trabajo, estudio, viajes y descanso.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#B7FF00] px-8 py-4 font-black text-black transition hover:scale-105"
            >
              Comprar
            </a>
            <a
              href="#benefits"
              className="rounded-full border-2 border-[#7B2CFF] px-8 py-4 font-bold text-[#7B2CFF] transition hover:bg-[#7B2CFF] hover:text-white"
            >
              Ver beneficios
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-5 rounded-[2rem] border border-[#DDD6D0] bg-white/70 p-6 backdrop-blur">
            <div className="text-center">
              <Volume2 className="mx-auto text-[#7B2CFF]" size={30} />
              <p className="mt-3 font-black">Reduce ruido</p>
              <span className="text-sm text-[#666]">hasta 23dB</span>
            </div>
            <div className="text-center">
              <ShieldCheck className="mx-auto text-[#7B2CFF]" size={30} />
              <p className="mt-3 font-black">Protección</p>
              <span className="text-sm text-[#666]">certificada</span>
            </div>
            <div className="text-center">
              <Feather className="mx-auto text-[#7B2CFF]" size={30} />
              <p className="mt-3 font-black">Ultra cómodos</p>
              <span className="text-sm text-[#666]">y ligeros</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-[#B7FF00]/25 blur-[120px]" />
          <Image
            src="/images/mute-hero-hd.png"
            alt="Render premium de los earplugs Mute"
            width={1254}
            height={1254}
            priority
            sizes="(min-width: 1024px) 44rem, 100vw"
            className={sectionImageClass}
          />
        </div>
      </section>

      <section
        id="benefits"
        className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3"
      >
        {benefitCards.map(({ backgroundImage, icon: Icon, title, text }) => {
          const cardBackgroundImage =
            backgroundImage ??
            (title === "Trabajo & estudio"
              ? "/images/work.ear.png"
              : title === "Sueño & viajes"
                ? "/images/sleep.ear.png"
                : undefined);

          return (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-[2rem] border p-8 transition duration-500 hover:-translate-y-1 hover:shadow-xl ${
                cardBackgroundImage
                  ? "border-white/10 bg-[#252525] shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
                  : "border-[#DDD6D0] bg-white shadow-sm"
              }`}
            >
              {cardBackgroundImage ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${cardBackgroundImage}')` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.14)_0%,rgba(8,8,8,0.34)_38%,rgba(8,8,8,0.72)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(123,44,255,0.12),transparent_38%),radial-gradient(circle_at_bottom,rgba(183,255,0,0.08),transparent_32%)]" />
                  <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/12" />
                </>
              ) : null}

              <div
                className={`relative z-10 ${
                  cardBackgroundImage ? "text-[#B7FF00]" : "text-[#7B2CFF]"
                }`}
              >
                <Icon />
              </div>
              <h3
                className={`relative z-10 mt-5 text-2xl font-black ${
                  cardBackgroundImage
                    ? "max-w-[14rem] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]"
                    : "text-[#252525]"
                }`}
              >
                {title}
              </h3>
              <p
                className={`relative z-10 mt-3 leading-relaxed ${
                  cardBackgroundImage
                    ? "max-w-[16rem] text-[#F8F4E8] [text-shadow:0_2px_14px_rgba(0,0,0,0.52)]"
                    : "text-[#666]"
                }`}
              >
                {text}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 rounded-[2rem] border border-[#DDD6D0] bg-white p-6 md:grid-cols-5">
          {benefitBarItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <Icon className="mx-auto text-[#7B2CFF]" size={34} />
              <h3 className="mt-3 font-black">{title}</h3>
              <p className="text-sm text-[#666]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute h-[400px] w-[400px] rounded-full bg-[#7B2CFF]/20 blur-[100px]" />
          <div className="relative overflow-hidden rounded-[2rem]">
            <div className="relative min-h-[22rem] sm:min-h-[28rem]">
              <div className="absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-[#252525]/78 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white/85 backdrop-blur">
                {currentProductSlide.caption}
              </div>

              {isCurrentSlideBroken ? (
                <div className="relative z-10 flex min-h-[22rem] w-full items-end rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,#7B2CFF33,transparent_35%),linear-gradient(160deg,#252525_0%,#1C1C1C_60%,#101010_100%)] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:min-h-[28rem]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#B7FF00]">
                      Visual pendiente
                    </p>
                    <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
                      Product Lifestyle
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/72">
                      Agrega `/images/product-lifestyle.png` para mostrar esta
                      vista. El carrusel ya está preparado sin romper la web.
                    </p>
                  </div>
                </div>
              ) : (
                <Image
                  key={currentProductSlide.src}
                  src={currentProductSlide.src}
                  alt={currentProductSlide.alt}
                  width={1254}
                  height={1254}
                  quality={100}
                  sizes="(min-width: 1024px) 38rem, 100vw"
                  onError={() =>
                    setBrokenSlides((current) => ({
                      ...current,
                      [currentProductSlide.src]: true,
                    }))
                  }
                  className="relative z-10 w-full rounded-[2rem] object-cover border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.32)] transition-all duration-500 ease-out"
                />
              )}

              <button
                type="button"
                aria-label="Imagen anterior"
                onClick={goToPreviousSlide}
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#252525]/78 text-white backdrop-blur transition hover:scale-105 hover:bg-[#7B2CFF]"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                aria-label="Siguiente imagen"
                onClick={goToNextSlide}
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#252525]/78 text-white backdrop-blur transition hover:scale-105 hover:bg-[#7B2CFF]"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              {productSlides.map((slide, index) => {
                const isActive = index === activeProductSlide;

                return (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveProductSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-10 bg-[#7B2CFF]"
                        : "w-3 bg-[#252525]/20 hover:bg-[#252525]/40"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold uppercase tracking-widest text-[#7B2CFF]">
            Producto principal
          </p>
          <h2 className="mt-5 text-6xl font-black">VOID</h2>
          <p className="mt-6 text-lg leading-relaxed text-[#555]">
            Incluye earplugs premium, estuche portátil y diseño pensado para
            acompañarte todos los días. Protección auditiva moderna con estética
            premium.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#B7FF00]" />
              Protección auditiva cómoda
            </div>
            <div className="flex items-center gap-3">
              <Volume2 className="text-[#B7FF00]" />
              Sonido más claro y controlado
            </div>
            <div className="flex items-center gap-3">
              <Feather className="text-[#B7FF00]" />
              Diseño ligero y elegante
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-[#DDD6D0] bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="grid gap-6 border-b border-[#EEE7E2] pb-6 md:grid-cols-[auto_1fr] md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#7B2CFF]">
                  Desde
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-[#252525] md:text-5xl">
                  S/65
                </p>
              </div>

              <div className="md:flex md:justify-end md:pb-1">
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#7B2CFF] px-8 py-4 font-black text-white transition hover:scale-105"
                >
                  <MessageCircle size={22} />
                  Pedir por WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {includedItems.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-[#E8E1DC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F5F2_100%)] p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7B2CFF]/8">
                    <Icon className="text-[#7B2CFF]" size={22} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#252525]">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-5xl font-black">Comentarios reales</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#666]">
          Opiniones auténticas de personas que ya usan SafeSound en su día a
          día.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map(({ age, context, name, quote }) => (
            <div
              key={name}
              className="rounded-[2rem] border border-[#DDD6D0] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex gap-1 text-[#B7FF00]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="mt-5 text-lg leading-relaxed text-[#444]">
                “{quote}”
              </p>

              <div className="mt-8 border-t border-[#EEE7E2] pt-5">
                <p className="font-black text-[#252525]">{name}</p>
                <p className="mt-1 text-sm text-[#6F6A66]">
                  {age} años · {context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="empresas"
        className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-black/10" />
          <Image
            src="/images/mute-empresas-hd.png"
            alt="Presentación premium de SafeSound para empresas"
            width={1254}
            height={1254}
            sizes="(min-width: 1024px) 40rem, 100vw"
            className={sectionImageClass}
          />
        </div>

        <div>
          <Building2 className="text-[#7B2CFF]" size={50} />
          <h2 className="mt-6 text-6xl font-black">Empresas</h2>
          <p className="mt-6 text-lg leading-relaxed text-[#555]">
            SafeSound para empresas está diseñado para oficinas, coworkings,
            eventos corporativos y equipos expuestos a ruido constante.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#555]">
            Más que un accesorio, es una herramienta moderna para mejorar
            concentración, comodidad y bienestar dentro del entorno laboral.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#555]">
            Una solución premium para empresas que quieren ofrecer una
            experiencia diferente y útil a trabajadores o clientes.
          </p>

          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full bg-[#252525] px-8 py-4 font-black text-white transition hover:scale-105"
          >
            Cotizar para empresas
          </a>
        </div>
      </section>

      <section
        id="healthy"
        className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2"
      >
        <div>
          <HeartPulse className="text-[#B7FF00]" size={50} />
          <h2 className="mt-6 text-6xl font-black">Healthy Sound</h2>
          <p className="mt-6 text-lg leading-relaxed text-[#555]">
            Una línea enfocada en educación, bienestar auditivo y conciencia
            sobre el impacto del ruido en la vida diaria.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#555]">
            Pensado para estudiantes, trabajadores, personas sensibles al ruido
            y usuarios que buscan proteger su salud auditiva sin perder estilo.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#555]">
            Porque cuidar tus oídos también puede formar parte de tu lifestyle.
          </p>

          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full bg-[#7B2CFF] px-8 py-4 font-black text-white transition hover:scale-105"
          >
            Saber más
          </a>
        </div>

        <div className="relative">
          <div className="absolute h-[450px] w-[450px] rounded-full bg-[#B7FF00]/20 blur-[100px]" />
          <Image
            src="/images/mute-healthy-hd.png"
            alt="Earplugs SafeSound en una composición enfocada en bienestar auditivo"
            width={1254}
            height={1254}
            sizes="(min-width: 1024px) 40rem, 100vw"
            className={sectionImageClass}
          />
        </div>
      </section>

      <section
        className="group relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-cover bg-center bg-no-repeat px-8 py-20 text-center shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:px-14"
        style={{ backgroundImage: "url('/images/logo.ear.png')" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.16)_0%,rgba(18,18,18,0.42)_45%,rgba(18,18,18,0.82)_100%)]" />
        <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/12" />

          <div className="relative z-20 mx-auto max-w-2xl">
            <h2 className="text-5xl font-black text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.38)] md:text-6xl">
              Vive tu momento.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-[#F8F4E8] [text-shadow:0_2px_14px_rgba(0,0,0,0.42)]">
              Compra directa por WhatsApp. Atención rápida y personalizada.
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-black text-[#252525] transition hover:scale-105 hover:bg-[#F8F4E8]"
            >
              <MessageCircle size={22} />
              Comprar Mute
            </a>
          </div>
      </section>

      <footer className="py-12 text-center text-[#777]">
        © 2026 SafeSound - Mute the Noise
      </footer>

      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B7FF00] text-black shadow-[0_0_35px_rgba(183,255,0,0.75)] transition hover:scale-110"
      >
        <MessageCircle size={30} />
      </a>
    </main>
  );
}
