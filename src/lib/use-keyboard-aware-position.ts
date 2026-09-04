"use client";

import { useEffect, useState } from "react";

export type KeyboardAwarePosition = {
  enabled: boolean;
  top: number;
  height: number;
};

const MOBILE_MEDIA_QUERY = "(max-width: 639px)";
const KEYBOARD_THRESHOLD = 140;

export function useKeyboardAwarePosition(): KeyboardAwarePosition {
  const [position, setPosition] = useState<KeyboardAwarePosition>({
    enabled: false,
    top: 0,
    height: 0,
  });

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    let mobileQuery: MediaQueryList | null = null;
    try {
      mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    } catch {
      mobileQuery = null;
    }

    const update = () => {
      const isMobile = mobileQuery
        ? mobileQuery.matches
        : window.innerWidth < 640;
      if (!isMobile) {
        setPosition({ enabled: false, top: 0, height: 0 });
        return;
      }

      const keyboardOpen =
        viewport.height < window.innerHeight - KEYBOARD_THRESHOLD;
      if (!keyboardOpen) {
        setPosition({ enabled: false, top: 0, height: 0 });
        return;
      }

      setPosition({
        enabled: true,
        top: viewport.offsetTop,
        height: viewport.height,
      });
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    if (mobileQuery && typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", update);
    }

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      if (mobileQuery && typeof mobileQuery.removeEventListener === "function") {
        mobileQuery.removeEventListener("change", update);
      }
    };
  }, []);

  return position;
}