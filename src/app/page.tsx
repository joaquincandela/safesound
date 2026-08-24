"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Cross,
  Feather,
  HeartPulse,
  MessageCircle,
  Moon,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Volume2,
} from "lucide-react";
import PurchaseModal from "../components/PurchaseModal";
import ChatWidget from "../components/ChatWidget";
import CartDrawer from "../components/CartDrawer";
import VoidCatalogGrid from "../components/VoidCatalogGrid";
import { CartProvider, useCart } from "../lib/cart-context";
import {
  getVoidVariantById,
  getVoidVariantImage,
  VOID_FALLBACK_IMAGE,
  VOID_PRICE_VALUE,
  VOID_PRODUCT_NAME,
  voidVariants,
  type VoidVariant,
} from "../lib/void-catalog";

const waNumber = "51968255972";
const instagram =
  "https://www.instagram.com/safesound.pe?igsh=MTFtMnI2ZXNwdms5Zg%3D%3D&utm_source=qr";
const selectedVariantStorageKey = "safesound_void_selected_variant";

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
    backgroundImage: "/images/work.ear.png",
  },
  {
    icon: Moon,
    title: "Sueño & viajes",
    text: "Descansa mejor y viaja con tranquilidad.",
    backgroundImage: "/images/sleep.ear.png",
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

type ProductSlide = {
  alt: string;
  caption: string;
  src: string;
  kind?: "image" | "video";
};

export default function SafeSound() {
  return (
    <CartProvider>
      <SafeSoundLanding />
    </CartProvider>
  );
}

function SafeSoundLanding() {
  const { totalQuantity, addItem, openCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<VoidVariant>(voidVariants[0]);
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<{
    variant: "compra" | "empresa" | "healthy";
    product?: string;
  } | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [renderDragOffset, setRenderDragOffset] = useState(0);

  const dragStartX = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveringGalleryRef = useRef(false);
  const purchaseSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedId = window.localStorage.getItem(selectedVariantStorageKey);
    if (storedId) {
      setSelectedVariant(getVoidVariantById(storedId));
    }
  }, []);

  const productSlides: ProductSlide[] = [
    {
      src: brokenImages[selectedVariant.imageSrc]
        ? VOID_FALLBACK_IMAGE
        : getVoidVariantImage(selectedVariant),
      alt: selectedVariant.name,
      caption: selectedVariant.shortName,
    },
    {
      src: "/images/product-lifestyle.png",
      alt: "Producto SafeSound en una composición lifestyle",
      caption: "Lifestyle premium",
    },
    ...voidVariants
      .filter((variant) => variant.id !== selectedVariant.id)
      .map((variant) => ({
        src: brokenImages[variant.imageSrc]
          ? VOID_FALLBACK_IMAGE
          : getVoidVariantImage(variant),
        alt: variant.name,
        caption: variant.shortName,
      })),
  ];

  const currentProductSlide = productSlides[activeProductSlide] ?? productSlides[0];

  const persistVariant = (variant: VoidVariant) => {
    setSelectedVariant(variant);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(selectedVariantStorageKey, variant.id);
    }
  };

  const scrollToPurchaseSection = () => {
    purchaseSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleVariantSelect = (variant: VoidVariant, shouldScroll = false) => {
    persistVariant(variant);
    setActiveProductSlide(0);
    if (shouldScroll) {
      requestAnimationFrame(scrollToPurchaseSection);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleAddToCart = (variant: VoidVariant) => {
    addItem(variant);
    setToast({
      id: Date.now(),
      text: `${variant.name} agregado al carrito ✓`,
    });
  };

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

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isDraggingRef.current && !isHoveringGalleryRef.current) {
        setActiveProductSlide((current) =>
          current === productSlides.length - 1 ? 0 : current + 1
        );
      }
    }, 5000);
    return () => window.clearInterval(id);
  }, [activeProductSlide, productSlides.length]);

  const handleBrokenImage = (src: string) => {
    setBrokenImages((current) => ({ ...current, [src]: true }));
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartX.current = event.clientX;
    dragOffsetRef.current = 0;
    setRenderDragOffset(0);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const diff = event.clientX - dragStartX.current;
    dragOffsetRef.current = diff;
    setRenderDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    const offset = dragOffsetRef.current;
    isDraggingRef.current = false;
    setIsDragging(false);
    dragOffsetRef.current = 0;
    setRenderDragOffset(0);

    if (offset < -80) {
      goToNextSlide();
    } else if (offset > 80) {
      goToPreviousSlide();
    }
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
            <a href="#catalogo" className="transition hover:text-[#7B2CFF]">
              Catálogo
            </a>
            <a href="#empresas" className="transition hover:text-[#7B2CFF]">
              Empresas
            </a>
            <a href="#healthy" className="transition hover:text-[#7B2CFF]">
              Healthy Sound
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              aria-label={
                totalQuantity > 0
                  ? `Abrir carrito, ${totalQuantity} unidades`
                  : "Abrir carrito"
              }
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#DDD6D0] bg-white text-[#252525] shadow-sm transition hover:scale-105 hover:border-[#7B2CFF] hover:text-[#7B2CFF]"
            >
              <ShoppingCart size={20} />
              {totalQuantity > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#7B2CFF] px-1 text-xs font-black text-white shadow-sm">
                  {totalQuantity}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setModal({ variant: "compra", product: VOID_PRODUCT_NAME })}
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
            </button>

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

          <h1 className="mt-6 text-7xl font-black leading-none tracking-tight text-[#252525] md:text-8xl lg:text-9xl">
            V O I D
          </h1>

          <div className="mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#7B2CFF]/70 to-transparent" />

          <p className="mt-6 max-w-xl text-xl leading-relaxed text-[#555]">
            Earplugs premium diseñados para reducir el ruido sin aislarte.
            Pensados para conciertos, trabajo, estudio, viajes y descanso.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={scrollToPurchaseSection}
              className="rounded-full bg-[#B7FF00] px-8 py-4 font-black text-black transition hover:scale-105"
            >
              Elegir acabado
            </button>
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
              <span className="text-sm text-[#666]">hasta 23 dB</span>
            </div>
            <div className="text-center">
              <ShieldCheck className="mx-auto text-[#7B2CFF]" size={30} />
              <p className="mt-3 font-black">Protección</p>
              <span className="text-sm text-[#666]">uso diario</span>
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
            alt="Render premium de los earplugs VOID"
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
        {benefitCards.map(({ backgroundImage, icon: Icon, title, text }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#252525] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.14)_0%,rgba(8,8,8,0.34)_38%,rgba(8,8,8,0.72)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(123,44,255,0.12),transparent_38%),radial-gradient(circle_at_bottom,rgba(183,255,0,0.08),transparent_32%)]" />
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/12" />

            <div className="relative z-10 text-[#B7FF00]">
              <Icon />
            </div>
            <h3 className="relative z-10 mt-5 max-w-[14rem] text-2xl font-black text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
              {title}
            </h3>
            <p className="relative z-10 mt-3 max-w-[16rem] leading-relaxed text-[#F8F4E8] [text-shadow:0_2px_14px_rgba(0,0,0,0.52)]">
              {text}
            </p>
          </div>
        ))}
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

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative">
          <div className="absolute h-[400px] w-[400px] rounded-full bg-[#7B2CFF]/20 blur-[100px]" />
          <div
            tabIndex={0}
            role="region"
            aria-label="Galería de producto"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={() => {
              isHoveringGalleryRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveringGalleryRef.current = false;
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") goToPreviousSlide();
              if (event.key === "ArrowRight") goToNextSlide();
            }}
            className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_18%_18%,#7B2CFF1F,transparent_42%),radial-gradient(circle_at_85%_78%,#B7FF0026,transparent_40%),linear-gradient(160deg,#FFFFFF_0%,#F4F1EF_55%,#ECE7E1_100%)] outline-none"
          >
            <div className="relative aspect-square w-full sm:aspect-[4/3] lg:aspect-[2/1]">
              <div className="absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-[#252525]/78 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white/85 backdrop-blur">
                {currentProductSlide.caption}
              </div>

              <div
                className={`flex h-full w-full ${isDragging ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"}`}
                style={{
                  transform: `translateX(calc(-${activeProductSlide * 100}% + ${
                    isDragging ? renderDragOffset : 0
                  }px))`,
                  willChange: "transform",
                }}
              >
                {productSlides.map((slide) => (
                  <div
                    key={`${slide.caption}-${slide.src}`}
                    className="relative flex h-full w-full shrink-0 basis-full items-center justify-center p-6 sm:p-10 lg:p-14"
                  >
                    {slide.kind === "video" ? (
                      <video
                        key={slide.src}
                        src={slide.src}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-full w-full rounded-xl object-contain shadow-[0_24px_60px_rgba(37,37,37,0.22)]"
                      />
                    ) : (
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        width={1254}
                        height={1254}
                        quality={100}
                        draggable={false}
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        onError={() => handleBrokenImage(slide.src)}
                        className="h-full w-full object-contain drop-shadow-[0_28px_50px_rgba(37,37,37,0.22)]"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-[#DDD6D0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_28px_80px_rgba(37,37,37,0.14)]" />

              <button
                type="button"
                aria-label="Imagen anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPreviousSlide();
                }}
                onPointerDown={(event) => event.stopPropagation()}
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-md transition-all duration-300 hover:border-[#7B2CFF] hover:bg-[#7B2CFF] hover:shadow-[0_0_20px_rgba(123,44,255,0.4)] md:h-12 md:w-12"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                aria-label="Siguiente imagen"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNextSlide();
                }}
                onPointerDown={(event) => event.stopPropagation()}
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-md transition-all duration-300 hover:border-[#7B2CFF] hover:bg-[#7B2CFF] hover:shadow-[0_0_20px_rgba(123,44,255,0.4)] md:h-12 md:w-12"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {productSlides.map((slide, index) => {
                const isActive = index === activeProductSlide;
                return (
                  <button
                    key={`${slide.caption}-dot`}
                    type="button"
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveProductSlide(index)}
                    className={`rounded-full transition-all duration-500 ease-out ${
                      isActive
                        ? "h-2.5 w-8 bg-[#7B2CFF] shadow-[0_0_12px_rgba(123,44,255,0.4)]"
                        : "h-2.5 w-2.5 bg-[#252525]/15 hover:bg-[#252525]/30"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="catalogo"
        ref={purchaseSectionRef}
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#7B2CFF]">
              Catálogo VOID
            </p>
            <h2 className="mt-3 text-5xl font-black text-[#252525]">
              8 acabados, una misma experiencia premium
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#666]">
              Elige tu modelo, actualiza la sección principal y pide exactamente
              ese acabado por WhatsApp o desde el chat interno.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#DDD6D0] bg-white px-5 py-4 text-sm text-[#555] shadow-sm">
            Precio único: <span className="font-black text-[#252525]">{VOID_PRICE_VALUE}</span>
          </div>
        </div>

        <div className="mt-10">
          <VoidCatalogGrid
            selectedId={selectedVariant.id}
            variants={voidVariants}
            brokenImages={brokenImages}
            onBrokenImage={handleBrokenImage}
            onSelect={(variant) => handleVariantSelect(variant, true)}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-5xl font-black">Comentarios reales</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#666]">
          Opiniones auténticas de personas que ya usan SafeSound en su día a día.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map(({ age, context, name, quote }) => (
            <div
              key={name}
              className="rounded-[2rem] border border-[#DDD6D0] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex gap-1 text-[#B7FF00]">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star key={value} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-lg leading-relaxed text-[#444]">“{quote}”</p>
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

          <button
            type="button"
            onClick={() => setModal({ variant: "empresa" })}
            className="mt-10 inline-block rounded-full bg-[#252525] px-8 py-4 font-black text-white transition hover:scale-105"
          >
            Cotizar para empresas
          </button>
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

          <button
            type="button"
            onClick={() => setModal({ variant: "healthy" })}
            className="mt-10 inline-block rounded-full bg-[#7B2CFF] px-8 py-4 font-black text-white transition hover:scale-105"
          >
            Saber más
          </button>
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
          <button
            type="button"
            onClick={() => setModal({ variant: "compra", product: VOID_PRODUCT_NAME })}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-black text-[#252525] transition hover:scale-105 hover:bg-[#F8F4E8]"
          >
            <MessageCircle size={22} />
            Comprar VOID
          </button>
        </div>
      </section>

      <footer className="py-12 text-center text-[#777]">
        © 2026 SafeSound - Mute the Noise
      </footer>

      <CartDrawer whatsappNumber={waNumber} />

      <ChatWidget
        selectedVariant={selectedVariant}
        variants={voidVariants}
        onSelectVariant={(variant) => handleVariantSelect(variant)}
      />

      <PurchaseModal
        open={modal !== null}
        variant={modal?.variant}
        product={modal?.product}
        selectedVoidVariant={selectedVariant}
        onClose={() => setModal(null)}
      />

      {toast ? (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="toast-enter fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#252525]/95 px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          {toast.text}
        </div>
      ) : null}
    </main>
  );
}
