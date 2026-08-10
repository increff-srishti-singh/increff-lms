"use client";

import { useCallback, useRef } from "react";
import type { TourStep } from "@/features/learning/types";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { activeTourSteps, applyValue, hasAnyValue, openModal } from "@/shared/lib/tour-utils";
import { withStartTour } from "@/shared/lib/tour-registry";
import { useProgressStore } from "@/shared/stores/progress-store";
import type { TourConfig } from "@/features/learning/types";

let ShepherdModule: any = null;
/** Survive HMR / duplicate client module instances so Enter → Next keeps working. */
const TOUR_KEY = "__increffSharedTour";
let suppressCancelHandler = false;

function getTourInstance(): any {
  if (typeof globalThis === "undefined") return null;
  return (globalThis as any)[TOUR_KEY] ?? null;
}

function setTourInstance(tour: any) {
  if (typeof globalThis === "undefined") return;
  (globalThis as any)[TOUR_KEY] = tour;
}

export function getSharedTour() {
  return getTourInstance();
}

function destroyTourQuietly() {
  const tour = getTourInstance();
  if (!tour) return;
  suppressCancelHandler = true;
  try {
    tour.cancel();
  } catch {}
  setTourInstance(null);
  suppressCancelHandler = false;
}

/** Prep DOM for a step: open only the modal that step needs; close others. */
export function prepareDomForStep(
  config: TourConfig,
  stepIndex: number,
  steps?: TourStep[]
): HTMLElement | null {
  const list = steps || config.steps || [];
  const step = list[stepIndex] as any;
  if (!step) return null;

  for (let i = 0; i < stepIndex; i++) {
    const s = list[i] as any;
    if (s?.switchTabOnNext) {
      const tabEl = document.querySelector(s.switchTabOnNext) as HTMLElement | null;
      if (tabEl) tabEl.click();
    }
  }

  const el = document.querySelector(step.element) as HTMLElement | null;
  const neededOverlay = (el?.closest(".modal-overlay") as HTMLElement | null) || null;

  // Always close product modals the current step does not live in
  document.querySelectorAll(".modal-overlay.open").forEach((node) => {
    if (neededOverlay && node === neededOverlay) return;
    node.classList.remove("open");
  });
  // Hard-close known tour modal when leaving it (belt + suspenders)
  if (!neededOverlay || neededOverlay.id !== "modal-select-orders") {
    const orders = document.getElementById("modal-select-orders");
    if (orders) orders.classList.remove("open");
  }

  if (neededOverlay?.id) {
    openModal(neededOverlay.id);
  }

  if (typeof step.onEnter === "function") {
    try {
      step.onEnter(useTrainingStore.getState().mode);
    } catch {}
  }

  return neededOverlay;
}

function waitForStepDom(overlay: HTMLElement | null, ms = 400): Promise<void> {
  if (overlay?.id) openModal(overlay.id);
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (!overlay) {
        requestAnimationFrame(() => setTimeout(resolve, 30));
        return;
      }
      if (overlay.classList.contains("open") || Date.now() - start > ms) {
        requestAnimationFrame(() => setTimeout(resolve, 30));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export function advanceTour() {
  const state = useTrainingStore.getState();
  const { config, currentStepIndex, mode, selectedScenario } = state;
  const sharedTour = getTourInstance();
  if (!config || !sharedTour) return;
  const steps = activeTourSteps(config, selectedScenario?.id);
  const step = steps[currentStepIndex];
  if (!step) return;

  if (mode === "practice" && step.required && step.expected && step.expected.type !== "action") {
    if (!hasAnyValue(step.expected)) {
      const note = document.querySelector(".shepherd-text .train-practice-note") as HTMLElement | null;
      if (note) {
        note.style.outline = "2px solid #d03238";
        setTimeout(() => {
          note.style.outline = "";
        }, 600);
      }
      return;
    }
  }

  if (step.navigateTo) {
    // Don't auto-resume next module — destination always opens Watch/Practice
    useCheckpointStore.getState().clear();
    state.finish();
    destroyTourQuietly();
    window.location.href = withStartTour(step.navigateTo);
    return;
  }

  if (currentStepIndex >= steps.length - 1) {
    useCheckpointStore.getState().clear();
    destroyTourQuietly();
    state.showSummary();
    return;
  }

  if ((step as any).openModalOnNext) {
    openModal((step as any).openModalOnNext);
    setTimeout(() => {
      const t = getTourInstance();
      if (t) t.next();
    }, 120);
    return;
  }

  if ((step as any).switchTabOnNext) {
    const tabEl = document.querySelector((step as any).switchTabOnNext) as HTMLElement;
    if (tabEl) tabEl.click();
    setTimeout(() => {
      const t = getTourInstance();
      if (t) t.next();
    }, 80);
    return;
  }

  sharedTour.next();
}

export function useTraining() {
  const store = useTrainingStore();
  const checkpoint = useCheckpointStore();
  const progress = useProgressStore();
  const panelUpdaterRef = useRef<((index: number) => void) | null>(null);

  const setPanelUpdater = useCallback((fn: (index: number) => void) => {
    panelUpdaterRef.current = fn;
  }, []);

  const getShepherd = useCallback(async () => {
    if (!ShepherdModule) {
      const mod = await import("shepherd.js");
      await import("shepherd.js/dist/css/shepherd.css");
      ShepherdModule = mod.default;
    }
    return ShepherdModule;
  }, []);

  const tryAdvance = useCallback(() => {
    advanceTour();
  }, []);

  const showHint = useCallback(() => {
    const state = useTrainingStore.getState();
    if (!state.config) return;
    const steps = activeTourSteps(state.config, state.selectedScenario?.id);
    const step = steps[state.currentStepIndex];
    if (!step) return;
    const msg = (step as any).practicePrompt || (step as any).hint || "Check the coach tip on the highlighted field.";
    const el = document.getElementById("tp-feedback");
    if (el) {
      el.textContent = msg;
      el.className = "feedback-msg hint";
    }
  }, []);

  const showMe = useCallback(() => {
    const state = useTrainingStore.getState();
    if (!state.config) return;
    const steps = activeTourSteps(state.config, state.selectedScenario?.id);
    const step = steps[state.currentStepIndex];
    if (!step) return;
    applyValue(step.expected);
    if (typeof step.onWatchFill === "function") step.onWatchFill();
    const el = document.getElementById("tp-feedback");
    if (el) {
      el.textContent = "Filled for you. Review it, then Next or Enter.";
      el.className = "feedback-msg ok";
    }
  }, []);

  const closeTour = useCallback(() => {
    const state = useTrainingStore.getState();
    if (state.config && state.phase === "active" && state.selectedScenario) {
      checkpoint.save({
        pageKey: state.config.pageKey,
        moduleId: state.config.moduleId,
        stepIndex: state.currentStepIndex,
        mode: state.mode,
        scenario: state.selectedScenario,
        path: window.location.pathname,
        href: window.location.pathname + window.location.search,
        title: state.config.title,
      });
      store.pauseTour();
    }
    // Quiet destroy — avoid cancel handler fighting pause state / leftover overlay
    destroyTourQuietly();
  }, [checkpoint, store]);

  const beginTour = useCallback(
    async (startIndex = 0) => {
      const state = useTrainingStore.getState();
      const { config, mode, selectedScenario } = state;
      if (!config || !selectedScenario) return;

      const Shepherd = await getShepherd();
      destroyTourQuietly();

      const steps = activeTourSteps(config, selectedScenario.id);
      const safeIndex = Math.max(0, Math.min(startIndex, steps.length - 1));

      const needed = prepareDomForStep(config, safeIndex, steps);
      await waitForStepDom(needed);

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        modalOverlayOpeningPadding: 6,
        modalOverlayOpeningRadius: 4,
        confirmCancel: false,
        exitOnEsc: true,
        keyboardNavigation: false,
        defaultStepOptions: {
          cancelIcon: { enabled: true },
          scrollTo: { behavior: "smooth", block: "center" },
          canClickTarget: true,
        },
      });

      tour.on("show", (event: any) => {
        const stepInstance = event?.step || tour.getCurrentStep?.();
        const id = stepInstance?.id || "";
        const match = String(id).match(/^step-(\d+)$/);
        const stepIdx = match ? parseInt(match[1], 10) : -1;
        if (stepIdx < 0) return;

        store.setStepIndex(stepIdx);
        const step = steps[stepIdx];
        if (!step) return;

        // Sync product modal with this step (open if needed, close otherwise)
        prepareDomForStep(config, stepIdx, steps);

        checkpoint.save({
          pageKey: config.pageKey,
          moduleId: config.moduleId,
          stepIndex: stepIdx,
          mode: useTrainingStore.getState().mode,
          scenario: selectedScenario,
          path: window.location.pathname,
          href: window.location.pathname + window.location.search,
          title: config.title,
        });
        panelUpdaterRef.current?.(stepIdx);

        const feedback = document.getElementById("tp-feedback");
        if (feedback) {
          feedback.textContent = "";
          feedback.className = "feedback-msg";
        }

        setTimeout(() => {
          const target = document.querySelector(step.element) as HTMLElement | null;
          let focusTarget: HTMLElement | null = null;
          if (target) {
            if (target.matches("input, select, textarea, button, a")) {
              focusTarget = target;
            } else {
              focusTarget = target.querySelector(
                "input:not([type='hidden']), select, textarea, button, a"
              ) as HTMLElement | null;
            }
          }
          if (!focusTarget) {
            focusTarget = document.querySelector(
              ".shepherd-enabled .shepherd-button-primary"
            ) as HTMLElement | null;
          }
          if (focusTarget && typeof focusTarget.focus === "function") {
            focusTarget.focus();
          }
        }, 50);

        if (mode === "watch") {
          applyValue(step.expected);
          if (typeof step.onWatchFill === "function") step.onWatchFill();
        }
      });

      tour.on("cancel", () => {
        if (suppressCancelHandler) {
          setTourInstance(null);
          return;
        }
        const s = useTrainingStore.getState();
        if (s.phase === "active" && s.config && s.selectedScenario) {
          checkpoint.save({
            pageKey: s.config.pageKey,
            moduleId: s.config.moduleId,
            stepIndex: s.currentStepIndex,
            mode: s.mode,
            scenario: s.selectedScenario,
            path: window.location.pathname,
            href: window.location.pathname + window.location.search,
            title: s.config.title,
          });
          store.pauseTour();
        }
        setTourInstance(null);
      });

      tour.on("complete", () => {
        checkpoint.clear();
        store.showSummary();
        setTourInstance(null);
      });

      steps.forEach((step: TourStep, idx: number) => {
        const isLast = idx === steps.length - 1;
        tour.addStep({
          id: `step-${idx}`,
          text: buildStepDescription(step, mode, idx, steps.length),
          title: step.title,
          attachTo: {
            element: step.element,
            on: step.side || "bottom",
          },
          beforeShowPromise: () => {
            const overlay = prepareDomForStep(config, idx, steps);
            return waitForStepDom(overlay);
          },
          buttons: [
            ...(idx > 0
              ? [
                  {
                    action: () => tour.back(),
                    classes: "shepherd-button-secondary",
                    text: "Back",
                  },
                ]
              : []),
            {
              action: () => advanceTour(),
              classes: "shepherd-button-primary",
              text: isLast ? "Finish" : "Next",
            },
          ],
        });
      });

      setTourInstance(tour);
      store.setStepIndex(safeIndex);

      if (safeIndex > 0) {
        // Shepherd only calls setupModal() inside start(). start() also jumps to step 0.
        // For Continue demo we must set up the overlay, then show the checkpoint step.
        tour.setupModal();
        tour.show(`step-${safeIndex}`);
      } else {
        tour.start();
      }
    },
    [getShepherd, checkpoint, store]
  );

  const skipQuiz = useCallback(() => {
    if (!store.config) return;
    progress.markComplete(store.config.moduleId, { quizSkipped: true });
    store.finish();
  }, [store.config, progress, store.finish]);

  const completeQuiz = useCallback(
    (score: number, total: number) => {
      if (!store.config) return;
      progress.markComplete(store.config.moduleId, { quizScore: score, quizTotal: total });
      store.finish();
    },
    [store.config, progress, store.finish]
  );

  return {
    ...store,
    tryAdvance,
    beginTour,
    setPanelUpdater,
    tourRef: { current: getTourInstance() },
    skipQuiz,
    completeQuiz,
    showHint,
    showMe,
    closeTour,
  };
}

function buildStepDescription(step: TourStep, mode: "watch" | "practice", idx: number, total: number) {
  let html = `<span class="train-step-progress">Step ${idx + 1} of ${total}</span>`;
  html += `<div>${step.description}</div>`;
  if (step.commonMistakes) {
    html += `<div class="train-mistakes"><strong>Avoid:</strong> ${step.commonMistakes}</div>`;
  }
  if (mode === "practice" && step.required && step.expected?.type !== "action") {
    html += `<div class="train-practice-note">Required — enter any value, then <strong>Next</strong> or <strong>Enter</strong>.</div>`;
  } else if (mode === "practice" && step.expected?.type !== "action" && !step.required) {
    html += `<div class="train-practice-note">Optional — fill or skip with <strong>Next</strong> or <strong>Enter</strong>.</div>`;
  }
  return html;
}
