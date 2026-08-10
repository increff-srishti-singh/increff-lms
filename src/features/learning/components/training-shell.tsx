"use client";

import React from "react";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useTraining } from "@/features/learning/hooks/use-training";
import { DemoBanner } from "@/features/learning/components/demo-banner";
import { TrainingPanel } from "@/features/learning/components/training-panel";
import { ModePicker } from "@/features/learning/components/mode-picker";
import { PathPicker } from "@/features/learning/components/path-picker";
import { ScenarioPicker } from "@/features/learning/components/scenario-picker";
import { SummaryOverlay } from "@/features/learning/components/summary-overlay";
import { Quiz } from "@/features/learning/components/quiz";
import { TourFloatActions } from "@/features/learning/components/tour-float-actions";
import { GlossaryDrawer } from "@/features/learning/components/glossary-drawer";
import { TrainingProvider } from "@/providers/training-provider";
import {
  continueLabelFor,
  continueLearningHref,
  getLearningNext,
  pathOptionStartHref,
} from "@/shared/lib/learning-path";

export function TrainingShell({ children }: { children: React.ReactNode }) {
  return (
    <TrainingProvider>
      <TrainingShellInner>{children}</TrainingShellInner>
    </TrainingProvider>
  );
}

function TrainingShellInner({ children }: { children: React.ReactNode }) {
  const { phase, config, skipQuiz, completeQuiz, beginTour } = useTraining();
  const store = useTrainingStore();
  const pathGroup = store.pathGroup;

  const handleModeContinue = (selectedMode: "watch" | "practice") => {
    store.setMode(selectedMode);
    if (config!.scenarios.length > 1) {
      store.openScenarioPicker();
      return;
    }
    store.selectScenario(config!.scenarios[0]);
    store.beginTour();
    setTimeout(() => beginTour(0), 100);
  };

  const handleScenarioSelect = (scenario: any) => {
    store.selectScenario(scenario);
    store.beginTour();
    setTimeout(() => beginTour(0), 100);
  };

  const handleContinueLearning = () => {
    const next = getLearningNext(config?.pageKey);
    skipQuiz();
    if (!next || next.type === "dashboard") {
      window.location.href = config?.homeHref || "/";
      return;
    }
    if (next.type === "path-group") {
      store.openPathPicker(next.group);
      return;
    }
    window.location.href = continueLearningHref(next);
  };

  return (
    <>
      <DemoBanner />
      {children}
      <TrainingPanel />
      {phase === "path-picker" && pathGroup && (
        <PathPicker
          group={pathGroup}
          onSelect={(option) => {
            store.reset();
            window.location.href = pathOptionStartHref(option);
          }}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "mode-picker" && config && (
        <ModePicker
          config={config}
          onContinue={handleModeContinue}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "scenario-picker" && config && (
        <ScenarioPicker
          scenarios={config.scenarios}
          onSelect={handleScenarioSelect}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "summary" && config && (
        <SummaryOverlay
          config={config}
          continueLabel={continueLabelFor(config)}
          onStartOver={() => {
            store.openModePicker(config);
          }}
          onContinueLearning={handleContinueLearning}
          onTakeQuiz={() => store.showQuiz()}
        />
      )}
      {phase === "quiz" && config && (
        <Quiz quiz={config.quiz} onComplete={completeQuiz} />
      )}
      <TourFloatActions />
      <GlossaryDrawer />
    </>
  );
}
