export type VoidVariant = {
  id: string;
  name: string;
  shortName: string;
  finish: string;
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
    imageSrc: "/images/DORADONEGRO.jpeg",
    swatches: ["#111111", "#D7B45E"],
  },
  {
    id: "yellow-gold",
    name: "VOID Yellow Gold",
    shortName: "Yellow Gold",
    finish: "Amarillo · Dorado",
    imageSrc: "/images/DORADOAMARILLO.jpeg",
    swatches: ["#F0C93D", "#D7B45E"],
  },
  {
    id: "white-silver",
    name: "VOID White Silver",
    shortName: "White Silver",
    finish: "Blanco · Plateado",
    imageSrc: "/images/PLATEADOBLANCO.jpeg",
    swatches: ["#F5F2EE", "#C4C9D4"],
  },
  {
    id: "black-silver",
    name: "VOID Black Silver",
    shortName: "Black Silver",
    finish: "Negro · Plateado",
    imageSrc: "/images/PLATEADONEGRO.jpeg",
    swatches: ["#151515", "#B6BCC8"],
  },
  {
    id: "white-purple",
    name: "VOID White Purple",
    shortName: "White Purple",
    finish: "Blanco · Morado",
    imageSrc: "/images/MORADOBLANCO.jpeg",
    swatches: ["#F5F2EE", "#7B2CFF"],
  },
  {
    id: "white-rose-gold",
    name: "VOID White Rose Gold",
    shortName: "White Rose Gold",
    finish: "Blanco · Oro Rosa",
    imageSrc: "/images/OROROSABLANCO.jpeg",
    swatches: ["#F5F2EE", "#D8A39B"],
  },
  {
    id: "white-clear",
    name: "VOID White Clear",
    shortName: "White Clear",
    finish: "Blanco · Transparente",
    imageSrc: "/images/TRANSPARENTEBLANCO.jpeg",
    swatches: ["#F5F2EE", "#DDE5EF"],
  },
  {
    id: "black-clear",
    name: "VOID Black Clear",
    shortName: "Black Clear",
    finish: "Negro · Transparente",
    imageSrc: "/images/TRANSPARENTENEGRO.jpeg",
    swatches: ["#111111", "#DDE5EF"],
  },
  {
    id: "purple-black",
    name: "VOID Purple Black",
    shortName: "Purple Black",
    finish: "Negro · Morado",
    imageSrc: "/images/MORADONEGRO.jpeg",
    swatches: ["#111111", "#7B2CFF"],
  },
  {
    id: "rose-gold-black",
    name: "VOID Rose gold Black",
    shortName: "Rose gold Black",
    finish: "Negro · Oro Rosa",
    imageSrc: "/images/OROROSANEGRO.jpeg",
    swatches: ["#111111", "#D8A39B"],
  },
  {
    id: "silver-yellow",
    name: "VOID Silver Yellow",
    shortName: "Silver Yellow",
    finish: "Plateado · Amarillo",
    imageSrc: "/images/PLATEADOAMARILLO.jpeg",
    swatches: ["#C4C9D4", "#F0C93D"],
  },
  {
    id: "silver-purple",
    name: "VOID Silver Purple",
    shortName: "Silver Purple",
    finish: "Plateado · Morado",
    imageSrc: "/images/PLATEADOMORADO.jpeg",
    swatches: ["#C4C9D4", "#7B2CFF"],
  },
  {
    id: "doble-purple",
    name: "VOID Doble Purple",
    shortName: "Doble Purple",
    finish: "Morado · Morado",
    imageSrc: "/images/MORADOMORADO.jpeg",
    swatches: ["#7B2CFF", "#7B2CFF"],
  },
  {
    id: "clear-yellow",
    name: "VOID Clear Yellow",
    shortName: "Clear Yellow",
    finish: "Transparente · Amarillo",
    imageSrc: "/images/TRANSPARENTEAMARILLO.jpeg",
    swatches: ["#DDE5EF", "#F0C93D"],
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
