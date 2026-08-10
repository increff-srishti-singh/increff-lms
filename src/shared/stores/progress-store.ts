import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleProgress } from "@/features/learning/types";
import { MODULES } from "@/shared/lib/curriculum";

interface ProgressState {
  _hasHydrated: boolean;
  modules: Record<string, ModuleProgress>;
  setHasHydrated: (v: boolean) => void;
  markComplete: (moduleId: string, meta?: Partial<ModuleProgress>) => void;
  completedCount: () => number;
  isComplete: (moduleId: string) => boolean;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      modules: {},
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      markComplete: (moduleId, meta) => {
        set((state) => ({
          modules: {
            ...state.modules,
            [moduleId]: {
              completed: true,
              completedAt: new Date().toISOString(),
              ...meta,
            },
          },
        }));
      },
      completedCount: () => {
        const { modules } = get();
        return MODULES.filter((m) => modules[m.id]?.completed).length;
      },
      isComplete: (moduleId) => !!get().modules[moduleId]?.completed,
      getModuleProgress: (moduleId) => get().modules[moduleId],
    }),
    {
      name: "increff-training-progress",
      skipHydration: true,
      partialize: (s) => ({ modules: s.modules }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
