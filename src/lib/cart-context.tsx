"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  VOID_PRICE_AMOUNT,
  VOID_PRICE_LABEL,
  voidVariants,
  type VoidVariant,
} from "./void-catalog";

const CART_STORAGE_KEY = "safesound_void_cart";
const MAX_QUANTITY_PER_VARIANT = 99;

export type CartLine = {
  variant: VoidVariant;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type CartContextValue = {
  lines: CartLine[];
  totalQuantity: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variant: VoidVariant) => void;
  incrementItem: (variantId: string) => void;
  decrementItem: (variantId: string) => void;
  removeItem: (variantId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function formatSoles(amount: number): string {
  return `S/ ${amount}`;
}

function readStoredQuantities(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    const valid: Record<string, number> = {};
    for (const [variantId, quantity] of Object.entries(
      parsed as Record<string, unknown>
    )) {
      if (
        voidVariants.some((variant) => variant.id === variantId) &&
        typeof quantity === "number" &&
        Number.isInteger(quantity) &&
        quantity >= 1
      ) {
        valid[variantId] = Math.min(quantity, MAX_QUANTITY_PER_VARIANT);
      }
    }
    return valid;
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isOpen, setIsOpen] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    setQuantities(readStoredQuantities());
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      // localStorage no disponible: el carrito solo vive en memoria
    }
  }, [quantities]);

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(quantities)
        .map(([variantId, quantity]) => {
          const variant = voidVariants.find((item) => item.id === variantId);
          if (!variant) return null;
          return {
            variant,
            quantity,
            unitPrice: VOID_PRICE_AMOUNT,
            lineTotal: VOID_PRICE_AMOUNT * quantity,
          };
        })
        .filter((line): line is CartLine => line !== null),
    [quantities]
  );

  const totalQuantity = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.lineTotal, 0),
    [lines]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((variant: VoidVariant) => {
    setQuantities((current) => ({
      ...current,
      [variant.id]: Math.min(
        (current[variant.id] ?? 0) + 1,
        MAX_QUANTITY_PER_VARIANT
      ),
    }));
  }, []);

  const incrementItem = useCallback((variantId: string) => {
    setQuantities((current) =>
      current[variantId]
        ? {
            ...current,
            [variantId]: Math.min(
              current[variantId] + 1,
              MAX_QUANTITY_PER_VARIANT
            ),
          }
        : current
    );
  }, []);

  const decrementItem = useCallback((variantId: string) => {
    setQuantities((current) => {
      if (!current[variantId] || current[variantId] <= 1) return current;
      return { ...current, [variantId]: current[variantId] - 1 };
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setQuantities((current) => {
      const next = { ...current };
      delete next[variantId];
      return next;
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQuantity,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
    }),
    [
      lines,
      totalQuantity,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}

export function buildCartOrderWhatsAppMessage(
  lines: CartLine[],
  subtotal: number
): string {
  const parts: string[] = [
    "Hola SafeSound 👋",
    "",
    "Quiero realizar el siguiente pedido:",
    "",
    "🛒 PEDIDO",
    "",
  ];

  lines.forEach((line, index) => {
    parts.push(
      `${index + 1}. ${line.variant.name}`,
      `Cantidad: ${line.quantity}`,
      `Precio unitario: ${VOID_PRICE_LABEL}`,
      `Subtotal: ${formatSoles(line.lineTotal)}`
    );
    if (index < lines.length - 1) {
      parts.push("");
    }
  });

  parts.push(
    "",
    "----------------------",
    "",
    `TOTAL DEL PEDIDO: ${formatSoles(subtotal)}`,
    "",
    "Quedo atento a la disponibilidad y coordinación de entrega."
  );

  return parts.join("\n");
}
