import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Scenario } from "@/features/learning/types";

const sessionStorageAdapter = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== "undefined") sessionStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") sessionStorage.removeItem(name);
  },
};

interface CheckpointState {
  _hasHydrated: boolean;
  pageKey: string | null;
  moduleId: string | null;
  stepIndex: number;
  mode: "watch" | "practice";
  scenario: Scenario | null;
  path: string | null;
  href: string | null;
  title: string | null;
  savedAt: number | null;
  setHasHydrated: (v: boolean) => void;
  save: (data: {
    pageKey: string;
    moduleId: string;
    stepIndex: number;
    mode: "watch" | "practice";
    scenario: Scenario;
    path: string;
    href: string;
    title: string;
  }) => void;
  clear: () => void;
  hasCheckpoint: () => boolean;
}

export const useCheckpointStore = create<CheckpointState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      pageKey: null,
      moduleId: null,
      stepIndex: 0,
      mode: "practice",
      scenario: null,
      path: null,
      href: null,
      title: null,
      savedAt: null,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      save: (data) => set({ ...data, savedAt: Date.now() }),
      clear: () =>
        set({
          pageKey: null,
          moduleId: null,
          stepIndex: 0,
          mode: "practice",
          scenario: null,
          path: null,
          href: null,
          title: null,
          savedAt: null,
        }),
      hasCheckpoint: () => !!get().pageKey,
    }),
    {
      name: "increff-tour-checkpoint",
      storage: createJSONStorage(() => sessionStorageAdapter),
      skipHydration: true,
      partialize: (s) => ({
        pageKey: s.pageKey,
        moduleId: s.moduleId,
        stepIndex: s.stepIndex,
        mode: s.mode,
        scenario: s.scenario,
        path: s.path,
        href: s.href,
        title: s.title,
        savedAt: s.savedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
