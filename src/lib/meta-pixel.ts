export const META_PIXEL_ID = "1016669647407159";

type PixelParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// El checkout de SafeSound se cierra por WhatsApp, así que no hay confirmación
// de pago en la web. "InitiateCheckout" y "Lead" son las señales de intención
// más cercanas a una compra que se pueden medir.
export function trackPixel(event: string, params?: PixelParams): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (params) {
      window.fbq("track", event, params);
    } else {
      window.fbq("track", event);
    }
  } catch {
    // El seguimiento nunca debe romper la compra
  }
}
