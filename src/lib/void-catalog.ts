export type VoidVariant = {
  id: string;
  name: string;
  shortName: string;
  finish: string;
  reference: string;
  imageSrc: string;
  swatches: [string, string];
};

export const VOID_PRODUCT_NAME = "VOID";
export const VOID_PRICE_LABEL = "S/ 65";
export const VOID_PRICE_VALUE = "S/ 65.00";
export const VOID_PRICE_AMOUNT = 65;
export const VOID_NOISE_REDUCTION = "-23 dB";
export const VOID_FALLBACK_IMAGE = "/images/mute-hero-hd.png";

export const voidIncludedItems = [
  "Earplugs VOID",
  "Estuche portátil",
  "2 pares de tallas de repuesto",
  "Silicona médica hipoalergénica",
] as const;

export const voidGeneralFeatures = [
  "Reducción de ruido: -23 dB",
  "Silicona médica hipoalergénica",
  "Reutilizables y lavables",
  "Incluye estuche",
  "Incluye earplugs",
  "Incluye 2 pares de almohadillas/tallas de repuesto",
] as const;

export const voidVariants: VoidVariant[] = [
  {
    id: "black-gold",
    name: "VOID Black Gold",
    shortName: "Black Gold",
    finish: "Negro · Dorado",
    reference: "SH60612-001",
    imageSrc: "/images/negrocondorado.png",
    swatches: ["#111111", "#D7B45E"],
  },
  {
    id: "yellow-gold",
    name: "VOID Yellow Gold",
    shortName: "Yellow Gold",
    finish: "Amarillo · Dorado",
    reference: "SH60612-002",
    imageSrc: "/images/doradoconamarillo.png",
    swatches: ["#F0C93D", "#D7B45E"],
  },
  {
    id: "white-silver",
    name: "VOID White Silver",
    shortName: "White Silver",
    finish: "Blanco · Plateado",
    reference: "SH60612-004",
    imageSrc: "/images/plateadoconblanco.png",
    swatches: ["#F5F2EE", "#C4C9D4"],
  },
  {
    id: "black-silver",
    name: "VOID Black Silver",
    shortName: "Black Silver",
    finish: "Negro · Plateado",
    reference: "SH60612-005",
    imageSrc: "/images/plateadoconnegro.png",
    swatches: ["#151515", "#B6BCC8"],
  },
  {
    id: "white-purple",
    name: "VOID White Purple",
    shortName: "White Purple",
    finish: "Blanco · Morado",
    reference: "SH60612-008",
    imageSrc: "/images/moradoconblanco.png",
    swatches: ["#F5F2EE", "#7B2CFF"],
  },
  {
    id: "white-rose-gold",
    name: "VOID White Rose Gold",
    shortName: "White Rose Gold",
    finish: "Blanco · Oro Rosa",
    reference: "SH60612-012",
    imageSrc: "/images/rosadoconblanco.png",
    swatches: ["#F5F2EE", "#D8A39B"],
  },
  {
    id: "white-clear",
    name: "VOID White Clear",
    shortName: "White Clear",
    finish: "Blanco · Transparente",
    reference: "SH60612-016",
    imageSrc: "/images/transparentes.png",
    swatches: ["#F5F2EE", "#DDE5EF"],
  },
  {
    id: "black-clear",
    name: "VOID Black Clear",
    shortName: "Black Clear",
    finish: "Negro · Transparente",
    reference: "SH60612-017",
    imageSrc: "/images/trasnparenteconnegro.png",
    swatches: ["#111111", "#DDE5EF"],
  },
];

export function getVoidVariantById(id?: string | null): VoidVariant {
  return voidVariants.find((variant) => variant.id === id) ?? voidVariants[0];
}

export function getVoidVariantImage(
  variant: Pick<VoidVariant, "imageSrc">
): string {
  return variant.imageSrc || VOID_FALLBACK_IMAGE;
}

export function buildVoidWhatsAppMessage(variant: VoidVariant): string {
  return [
    "Hola SafeSound",
    "",
    "Quiero comprar:",
    "",
    `Producto: ${VOID_PRODUCT_NAME}`,
    `Modelo: ${variant.name}`,
    `Acabado: ${variant.finish}`,
    `Precio: ${VOID_PRICE_LABEL}`,
    "",
    "Me gustaría recibir más información sobre disponibilidad y entrega.",
  ].join("\n");
}
