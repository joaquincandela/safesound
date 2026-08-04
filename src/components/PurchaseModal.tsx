"use client";

import { useState } from "react";
import { X } from "lucide-react";

const waNumber = "51968255972";

const useOptions = [
  "Dormir",
  "Estudiar",
  "Conciertos",
  "Trabajo",
  "Minería",
  "Autismo",
  "Viajes",
  "Moto",
  "Disparo deportivo",
  "Otro",
];

type Variant = "compra" | "empresa" | "healthy";

type Props = {
  open: boolean;
  onClose: () => void;
  variant?: Variant;
  product?: string;
};

type FormErrors = {
  nombre?: string;
  celular?: string;
  cantidad?: string;
  distrito?: string;
  empresa?: string;
  opciones?: string;
};

export default function PurchaseModal({
  open,
  onClose,
  variant = "compra",
  product = "Void",
}: Props) {
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [distrito, setDistrito] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [ayuda, setAyuda] = useState("");
  const [opciones, setOpciones] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!open) return null;

  const toggleOption = (option: string) => {
    setOpciones((current) =>
      current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
    );
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (!celular.trim()) {
      e.celular = "Ingresa tu celular";
    } else if (!/^\d+$/.test(celular.trim())) {
      e.celular = "Solo números";
    }
    if (variant === "compra") {
      if (!cantidad || cantidad < 1) e.cantidad = "Mínimo 1";
      if (!distrito.trim()) e.distrito = "Ingresa tu distrito o provincia";
    } else if (variant === "empresa") {
      if (!empresa.trim()) e.empresa = "Ingresa el nombre de tu empresa";
      if (!distrito.trim()) e.distrito = "Ingresa tu distrito o provincia";
    } else {
      if (opciones.length === 0) e.opciones = "Selecciona al menos una opción";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const lines: string[] = [
      "Hola SafeSound 👋",
      "",
      "Quiero comprar:",
      "",
      "Producto:",
      product,
    ];

    if (variant === "compra") {
      lines.push(
        "",
        "Cantidad:",
        String(cantidad),
        "",
        "Distrito:",
        distrito.trim()
      );
    } else if (variant === "empresa") {
      lines.push(
        "",
        "Empresa:",
        empresa.trim(),
        "",
        "Distrito:",
        distrito.trim()
      );
    } else {
      lines.push("", "Para qué los quieres:");
      opciones.forEach((o) => lines.push(o));
    }

    lines.push(
      "",
      `Mi nombre es ${nombre.trim()}.`,
      "",
      "Mi celular es:",
      celular.trim()
    );

    if (ayuda.trim()) {
      lines.push(
        "",
        variant === "empresa"
          ? "Cuéntanos un poco cómo te podemos ayudar:"
          : "Cuéntanos más:",
        ayuda.trim()
      );
    }

    const msg = lines.join("\n");
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
  };

  const inputBase =
    "w-full rounded-xl border border-[#DDD6D0] bg-white px-4 py-3 text-[#252525] outline-none transition placeholder:text-[#aaa] focus:border-[#7B2CFF] focus:ring-2 focus:ring-[#7B2CFF]/20";

  const title =
    variant === "empresa"
      ? "Cotizar para empresas"
      : variant === "healthy"
        ? "Healthy Sound"
        : `Comprar ${product}`;

  const subtitle =
    variant === "empresa"
      ? "Completa tus datos y coordinamos una propuesta para tu empresa."
      : variant === "healthy"
        ? "Cuéntanos para qué los quieres y te asesoramos."
        : "Completa tus datos y te redirigimos a WhatsApp.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#999] transition hover:bg-[#f0f0f0] hover:text-[#252525]"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-[#252525]">{title}</h2>
        <p className="mt-1 text-sm text-[#888]">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {variant === "healthy" && (
            <div>
              <label className="mb-2 block text-sm font-bold text-[#252525]">
                ¿Para qué los quieres?
              </label>
              <div className="grid gap-2">
                {useOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DDD6D0] px-4 py-2.5 transition hover:border-[#7B2CFF] hover:bg-[#7B2CFF]/5"
                  >
                    <input
                      type="checkbox"
                      checked={opciones.includes(option)}
                      onChange={() => toggleOption(option)}
                      className="h-4 w-4 accent-[#7B2CFF]"
                    />
                    <span className="text-sm text-[#252525]">{option}</span>
                  </label>
                ))}
              </div>
              {errors.opciones && (
                <p className="mt-1 text-xs text-red-500">{errors.opciones}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-bold text-[#252525]">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className={inputBase}
            />
            {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="celular" className="mb-1 block text-sm font-bold text-[#252525]">
              Celular
            </label>
            <input
              id="celular"
              type="tel"
              inputMode="numeric"
              value={celular}
              onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
              placeholder="987654321"
              className={inputBase}
            />
            {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular}</p>}
          </div>

          <div>
            <label htmlFor="producto" className="mb-1 block text-sm font-bold text-[#252525]">
              Producto
            </label>
            <input
              id="producto"
              type="text"
              value={product}
              readOnly
              className={`${inputBase} cursor-not-allowed bg-[#f5f5f5] text-[#666]`}
            />
          </div>

          {variant === "compra" && (
            <div>
              <label htmlFor="cantidad" className="mb-1 block text-sm font-bold text-[#252525]">
                Cantidad <span className="font-normal text-[#888]">(valor inicial: 1)</span>
              </label>
              <input
                id="cantidad"
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className={inputBase}
              />
              {errors.cantidad && <p className="mt-1 text-xs text-red-500">{errors.cantidad}</p>}
            </div>
          )}

          {variant === "empresa" && (
            <div>
              <label htmlFor="empresa" className="mb-1 block text-sm font-bold text-[#252525]">
                Empresa
              </label>
              <input
                id="empresa"
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Nombre de tu empresa"
                className={inputBase}
              />
              {errors.empresa && <p className="mt-1 text-xs text-red-500">{errors.empresa}</p>}
            </div>
          )}

          {variant !== "healthy" && (
            <div>
              <label htmlFor="distrito" className="mb-1 block text-sm font-bold text-[#252525]">
                Distrito / Provincia
              </label>
              <input
                id="distrito"
                type="text"
                value={distrito}
                onChange={(e) => setDistrito(e.target.value)}
                placeholder="Ej: Miraflores"
                className={inputBase}
              />
              {errors.distrito && <p className="mt-1 text-xs text-red-500">{errors.distrito}</p>}
            </div>
          )}

          {variant !== "compra" && (
            <div>
              <label htmlFor="ayuda" className="mb-1 block text-sm font-bold text-[#252525]">
                {variant === "empresa"
                  ? "Cuéntanos un poco cómo te podemos ayudar"
                  : "Cuéntanos más"}{" "}
                <span className="font-normal text-[#888]">(opcional)</span>
              </label>
              <textarea
                id="ayuda"
                rows={3}
                value={ayuda}
                onChange={(e) => setAyuda(e.target.value)}
                placeholder={
                  variant === "empresa"
                    ? "Ej: 20 pares para nuestra oficina"
                    : "Ej: los uso para dormir"
                }
                className={`${inputBase} resize-none`}
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-[#7B2CFF] px-6 py-4 font-black text-white transition hover:scale-[1.02] hover:shadow-lg"
          >
            Continuar por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
