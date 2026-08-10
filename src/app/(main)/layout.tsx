"use client";

import { Suspense } from "react";
import { TrainingProvider } from "@/providers/training-provider";
import { DemoBanner } from "@/features/learning/components/demo-banner";
import { TrainingPanel } from "@/features/learning/components/training-panel";
import { TourFloatActions } from "@/features/learning/components/tour-float-actions";
import { GlossaryDrawer } from "@/features/learning/components/glossary-drawer";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { useTraining } from "@/features/learning/hooks/use-training";
import { ModePicker } from "@/features/learning/components/mode-picker";
import { PathPicker } from "@/features/learning/components/path-picker";
import { ScenarioPicker } from "@/features/learning/components/scenario-picker";
import { SummaryOverlay } from "@/features/learning/components/summary-overlay";
import { Quiz } from "@/features/learning/components/quiz";
import {
  continueLabelFor,
  continueLearningHref,
  getLearningNext,
  pathOptionStartHref,
} from "@/shared/lib/learning-path";

/** Product shell — same structure as original wms/*.html (no custom sidebar). */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TrainingProvider>
        <MainLayoutInner>{children}</MainLayoutInner>
      </TrainingProvider>
    </Suspense>
  );
}

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const store = useTrainingStore();
  const training = useTraining();
  const { phase, config, pathGroup } = store;

  const handleContinueLearning = () => {
    const next = getLearningNext(config?.pageKey, store.selectedScenario?.id);
    training.skipQuiz();

    if (!next || next.type === "dashboard") {
      window.location.href = config?.homeHref || "/";
      return;
    }

    if (next.type === "path-group") {
      // Stay on page and ask which sub-module to learn next
      store.openPathPicker(next.group);
      return;
    }

    window.location.href = continueLearningHref(next);
  };

  return (
    <div className="product-app min-h-screen bg-[var(--bg)]" style={{ paddingTop: 48 }}>
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
          onContinue={(mode) => {
            store.setMode(mode);
            if (config.scenarios.length > 1) {
              store.openScenarioPicker();
              return;
            }
            store.selectScenario(config.scenarios[0]);
            store.beginTour();
            setTimeout(() => training.beginTour(0), 100);
          }}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "scenario-picker" && config && (
        <ScenarioPicker
          scenarios={config.scenarios}
          onSelect={(scenario) => {
            store.selectScenario(scenario);
            store.beginTour();
            setTimeout(() => training.beginTour(0), 100);
          }}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "summary" && config && (
        <SummaryOverlay
          config={config}
          continueLabel={continueLabelFor(config, store.selectedScenario?.id)}
          onStartOver={() => {
            useCheckpointStore.getState().clear();
            const pageKey = config.learningPageKey || config.pageKey;
            const href = config.learningModuleHref || config.pageHref || "/";
            if (typeof window !== "undefined" && window.location.pathname !== href && config.learningModuleHref) {
              sessionStorage.setItem("increff-tour-auto-continue", "start-over");
              sessionStorage.setItem(
                "increff-start-over-boot",
                JSON.stringify({ pageKey, mode: store.mode || "watch" })
              );
              window.location.href = href;
              return;
            }
            store.openModePicker(config);
          }}
          onContinueLearning={handleContinueLearning}
          onTakeQuiz={() => store.showQuiz()}
        />
      )}
      {phase === "quiz" && config && (
        <Quiz quiz={config.quiz} onComplete={training.completeQuiz} />
      )}

      <TourFloatActions />
      <GlossaryDrawer />
    </div>
  );
}
