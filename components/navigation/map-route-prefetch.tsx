"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function MapRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const prefetch = () => {
      router.prefetch("/map");
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => prefetch());

      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(prefetch, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  return null;
}
