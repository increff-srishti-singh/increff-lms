import { create } from "zustand";
import type { TourConfig, Scenario, TrainingMode, TrainingPhase, PathGroupId } from "@/features/learning/types";

interface TrainingState {
  phase: TrainingPhase;
  mode: TrainingMode;
  config: TourConfig | null;
  selectedScenario: Scenario | null;
  currentStepIndex: number;
  isStarted: boolean;
  pathGroup: PathGroupId | null;
  openModePicker: (config: TourConfig) => void;
  openPathPicker: (group: PathGroupId) => void;
  openScenarioPicker: () => void;
  loadConfig: (config: TourConfig) => void;
  setMode: (mode: TrainingMode) => void;
  selectScenario: (scenario: Scenario) => void;
  beginTour: (startIndex?: number) => void;
  setStepIndex: (index: number) => void;
  advanceStep: () => void;
  pauseTour: () => void;
  resumeFromCheckpoint: (startIndex?: number) => void;
  showSummary: () => void;
  showQuiz: () => void;
  finish: () => void;
  reset: () => void;
}

export const useTrainingStore = create<TrainingState>()((set, get) => ({
  phase: "idle",
  mode: "watch",
  config: null,
  selectedScenario: null,
  currentStepIndex: 0,
  isStarted: false,
  pathGroup: null,

  openModePicker: (config) =>
    set({ config, phase: "mode-picker", mode: "watch", pathGroup: null, isStarted: true }),
  openPathPicker: (group) =>
    set({ phase: "path-picker", pathGroup: group, config: null, isStarted: true }),
  openScenarioPicker: () => set({ phase: "scenario-picker" }),
  loadConfig: (config) => set({ config, isStarted: true }),
  setMode: (mode) => set({ mode }),
  selectScenario: (scenario) => set({ selectedScenario: scenario }),
  beginTour: (startIndex = 0) => set({ phase: "active", currentStepIndex: startIndex, isStarted: true }),
  setStepIndex: (index) => set({ currentStepIndex: index }),
  advanceStep: () => {
    const { config, currentStepIndex, selectedScenario } = get();
    if (!config) return;
    const total = selectedScenario
      ? config.steps.filter((s) => !s.scenarioIds?.length || s.scenarioIds.includes(selectedScenario.id)).length
      : config.steps.length;
    if (currentStepIndex + 1 < total) {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },
  pauseTour: () => set({ phase: "paused" }),
  resumeFromCheckpoint: (startIndex = 0) =>
    set({ phase: "active", currentStepIndex: startIndex, isStarted: true }),
  showSummary: () => set({ phase: "summary" }),
  showQuiz: () => set({ phase: "quiz" }),
  finish: () =>
    set({
      phase: "idle",
      config: null,
      selectedScenario: null,
      currentStepIndex: 0,
      isStarted: false,
      pathGroup: null,
    }),
  reset: () =>
    set({
      phase: "idle",
      mode: "watch",
      config: null,
      selectedScenario: null,
      currentStepIndex: 0,
      isStarted: false,
      pathGroup: null,
    }),
}));
