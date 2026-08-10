"use client";

import { useEffect } from "react";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { advanceTour, getSharedTour } from "@/features/learning/hooks/use-training";

/**
 * Enter = Next for every tour step (same behavior as the original training engine).
 * Capture-phase + stopImmediatePropagation so Shepherd's × / buttons don't steal it.
 */
export function useKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }

      const state = useTrainingStore.getState();
      if (state.phase !== "active" || !state.isStarted) return;
      if (!getSharedTour()) return;

      const tag = (e.target as HTMLElement)?.tagName || "";
      if (tag === "TEXTAREA") return;

      // Always treat Enter as Next while the tour is active (not as Close on ×).
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      advanceTour();
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, []);
}
