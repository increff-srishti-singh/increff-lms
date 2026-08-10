"use client";

import React, { createContext, useContext, useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTraining } from "@/features/learning/hooks/use-training";
import { useKeyboard } from "@/features/learning/hooks/use-keyboard";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { AUTO_CONTINUE_KEY, START_TOUR_PARAM, getTourByPageKey, getTourByPathname } from "@/shared/lib/tour-registry";
import { CHOOSE_PATH_PARAM } from "@/shared/lib/learning-path";
import type { TourConfig, Scenario, PathGroupId } from "@/features/learning/types";

interface TrainingContextType {
  startTraining: (config: TourConfig) => void;
  startWithScenario: (config: TourConfig, scenario: Scenario, startIndex?: number) => void;
  continueFromCheckpoint: () => void;
  startOverFromCheckpoint: () => void;
}

const TrainingContext = createContext<TrainingContextType | null>(null);

export function useTrainingContext() {
  const ctx = useContext(TrainingContext);
  if (!ctx) throw new Error("useTrainingContext must be used within TrainingProvider");
  return ctx;
}

export function TrainingProvider({ children }: { children: React.ReactNode }) {
  const training = useTraining();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useKeyboard();

  const startTraining = useCallback(
    (config: TourConfig) => {
      training.openModePicker(config);
    },
    [training]
  );

  const startWithScenario = useCallback(
    (config: TourConfig, scenario: Scenario, startIndex = 0) => {
      const store = useTrainingStore.getState();
      store.loadConfig(config);
      store.setMode(config.mode || "watch");
      store.selectScenario(scenario);
      store.beginTour(startIndex);
      setTimeout(() => training.beginTour(startIndex), 120);
    },
    [training]
  );

  const continueFromCheckpoint = useCallback(() => {
    const ck = useCheckpointStore.getState();
    if (!ck.pageKey || !ck._hasHydrated) return;

    const config = getTourByPageKey(ck.pageKey);
    if (!config) return;

    const targetPath = ck.path || config.pageHref || "/";
    const onTargetPage =
      typeof window !== "undefined" &&
      (window.location.pathname === targetPath ||
        window.location.pathname === (ck.href || "").split("?")[0] ||
        (config.pageHref && window.location.pathname === config.pageHref));

    if (!onTargetPage) {
      sessionStorage.setItem(AUTO_CONTINUE_KEY, "1");
      window.location.href = ck.href || ck.path || config.pageHref || "/";
      return;
    }

    const scenario =
      ck.scenario ||
      config.scenarios[0] || {
        id: "resume",
        title: "Continue",
        story: "Pick up where you left off.",
      };
    const startIndex = Math.max(0, Number(ck.stepIndex) || 0);
    const store = useTrainingStore.getState();
    store.loadConfig(config);
    store.setMode(ck.mode || "watch");
    store.selectScenario(scenario);
    store.resumeFromCheckpoint(startIndex);
    // Give React a tick to paint the coach panel, then resume Shepherd mid-tour
    setTimeout(() => training.beginTour(startIndex), 200);
  }, [training]);

  const startOverFromCheckpoint = useCallback(() => {
    const ck = useCheckpointStore.getState();
    const config = getTourByPageKey(ck.pageKey) || (useTrainingStore.getState().config as TourConfig | null);
    useCheckpointStore.getState().clear();
    sessionStorage.removeItem(AUTO_CONTINUE_KEY);

    if (!config) {
      window.location.href = "/";
      return;
    }

    const restartKey = config.learningPageKey || config.pageKey;
    const target = config.learningModuleHref || config.pageHref || ck.path || "/";
    if (typeof window !== "undefined" && window.location.pathname !== target) {
      sessionStorage.setItem(AUTO_CONTINUE_KEY, "start-over");
      sessionStorage.setItem(
        "increff-start-over-boot",
        JSON.stringify({ pageKey: restartKey, mode: "practice" })
      );
      window.location.href = target;
      return;
    }

    const restartConfig = getTourByPageKey(restartKey) || config;
    useTrainingStore.getState().openModePicker(restartConfig);
  }, []);

  // After persist rehydrate / navigation: auto-continue if flagged
  useEffect(() => {
    const tryAuto = () => {
      const ck = useCheckpointStore.getState();
      if (!ck._hasHydrated) {
        setTimeout(tryAuto, 50);
        return;
      }

      const auto = sessionStorage.getItem(AUTO_CONTINUE_KEY);
      if (!auto) return;

      const config = getTourByPageKey(ck.pageKey);
      if (auto === "start-over") {
        sessionStorage.removeItem(AUTO_CONTINUE_KEY);
        const bootRaw = sessionStorage.getItem("increff-start-over-boot");
        let bootPageKey = ck.pageKey;
        if (bootRaw) {
          try {
            bootPageKey = JSON.parse(bootRaw).pageKey || bootPageKey;
          } catch {}
          sessionStorage.removeItem("increff-start-over-boot");
        }
        const bootConfig = getTourByPageKey(bootPageKey);
        ck.clear();
        if (bootConfig) {
          setTimeout(() => useTrainingStore.getState().openModePicker(bootConfig), 200);
        }
        return;
      }

      if (auto === "1" && config && ck.pageKey === config.pageKey) {
        // Only auto-resume if we're on the checkpoint page
        const onPage =
          window.location.pathname === (ck.path || "") ||
          window.location.pathname === (config.pageHref || "") ||
          (ck.href && window.location.pathname === ck.href.split("?")[0]);
        if (onPage) {
          sessionStorage.removeItem(AUTO_CONTINUE_KEY);
          setTimeout(() => continueFromCheckpoint(), 250);
        }
      }
    };

    tryAuto();
  }, [pathname, continueFromCheckpoint]);

  // Every module page entry: always show Watch/Practice (or path picker when choosePath is set)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const config = getTourByPathname(pathname);
    if (!config) return;

    const choosePath = searchParams.get(CHOOSE_PATH_PARAM) as PathGroupId | null;
    const hasStartTour = searchParams.get(START_TOUR_PARAM) === "1";

    // Clean tour query params from the URL when present
    if (hasStartTour || choosePath) {
      const url = new URL(window.location.href);
      url.searchParams.delete(START_TOUR_PARAM);
      url.searchParams.delete(CHOOSE_PATH_PARAM);
      const clean = url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : "");
      window.history.replaceState({}, "", clean);
    }

    // Only skip for true mid-step checkpoint handoff (Continue demo)
    if (sessionStorage.getItem(AUTO_CONTINUE_KEY) === "1") return;

    // Stale chain keys used to block the picker — clear them so every land shows it
    sessionStorage.removeItem("wmsTrainingResume");
    sessionStorage.removeItem("wmsB2cPickResume");
    sessionStorage.removeItem("wmsB2cPackResume");

    const state = useTrainingStore.getState();
    const sameModule = state.config?.pageKey === config.pageKey;

    // Don't interrupt an already-open overlay / tour for THIS module
    if (sameModule) {
      if (
        state.phase === "active" ||
        state.phase === "summary" ||
        state.phase === "quiz" ||
        state.phase === "mode-picker" ||
        state.phase === "scenario-picker"
      ) {
        return;
      }
    }

    // Path picker stays until user picks (may be on hub page)
    if (state.phase === "path-picker" && choosePath) return;

    useCheckpointStore.getState().clear();

    if (choosePath === "picking" || choosePath === "packing") {
      const t = window.setTimeout(() => {
        useTrainingStore.getState().openPathPicker(choosePath);
      }, 180);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      useTrainingStore.getState().openModePicker(config);
    }, 180);
    return () => window.clearTimeout(t);
  }, [pathname, searchParams]);

  return (
    <TrainingContext.Provider
      value={{ startTraining, startWithScenario, continueFromCheckpoint, startOverFromCheckpoint }}
    >
      {children}
    </TrainingContext.Provider>
  );
}
