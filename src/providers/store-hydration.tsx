"use client";

import { useEffect } from "react";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { useProgressStore } from "@/shared/stores/progress-store";

/** Rehydrate zustand persist stores after mount — avoids SSR/client HTML mismatch. */
export function StoreHydration() {
  useEffect(() => {
    void useProgressStore.persist.rehydrate();
    void useCheckpointStore.persist.rehydrate();
  }, []);

  return null;
}
