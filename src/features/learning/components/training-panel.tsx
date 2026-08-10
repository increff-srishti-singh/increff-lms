"use client";

import React from "react";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useTraining } from "@/features/learning/hooks/use-training";
import { activeTourSteps } from "@/shared/lib/tour-utils";

export function TrainingPanel() {
  const { phase, config, currentStepIndex, mode, selectedScenario } = useTrainingStore();
  const { showHint, showMe, closeTour } = useTraining();

  if (phase !== "active" || !config) return null;

  const steps = activeTourSteps(config, selectedScenario?.id);
  const step = steps[currentStepIndex];
  const total = steps.length;
  const pct = Math.max(8, Math.round(((currentStepIndex + 1) / Math.max(total, 1)) * 100));
  const currentSkillIndex = step?.skillIndex ?? 1;
  const story = selectedScenario?.story || config.scenarios[0]?.story || "";

  return (
    <aside id="train-panel" className="train-panel open" aria-label="Training progress">
      <div className="train-panel-header">
        <div className="module-label">
          {config.track} · Module {config.number}
        </div>
        <h3>{config.title}</h3>
        <span className={`mode-badge ${mode}`}>{mode === "watch" ? "Watch" : "Practice"}</span>
      </div>

      <div className="train-panel-body">
        <div className="scenario-box">
          <strong>Scenario</strong>
          <span>{story}</span>
        </div>

        <div>
          <div className="progress-line" id="tp-progress-text">
            Step {currentStepIndex + 1} of {total} · {Math.round(((currentStepIndex + 1) / Math.max(total, 1)) * 100)}% complete
          </div>
          <div className="progress-bar">
            <span id="tp-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-steps" id="tp-progress-steps">
            {Array.from({ length: total }).map((_, i) => (
              <i
                key={i}
                className={i < currentStepIndex ? "done" : i === currentStepIndex ? "current" : ""}
                title={steps[i]?.title || `Step ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="current-step-card">
          <div className="current-step-label">Now on</div>
          <div className="current-step-title">{step?.title || "—"}</div>
          {step?.skillLabel && <div className="current-step-skill">{step.skillLabel}</div>}
        </div>

        <div>
          <div className="panel-section-label">Steps</div>
          <ul className="step-list">
            {steps.map((s, i) => {
              const done = i < currentStepIndex;
              const current = i === currentStepIndex;
              return (
                <li key={i} className={done ? "done" : current ? "current" : ""}>
                  <span className="step-num">{done ? "✓" : i + 1}</span>
                  <span className="step-name">{s.title}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="panel-section-label">Skills</div>
          <ul className="skills-list" id="tp-skills">
            {config.skills.map((skill, i) => {
              const skillNum = i + 1;
              const done = currentSkillIndex > skillNum;
              const active = currentSkillIndex === skillNum;
              return (
                <li key={i} className={done ? "done" : active ? "active" : ""}>
                  <span className="skill-check">{done ? "✓" : active ? "●" : "○"}</span>
                  {skill}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="why-box">
          <details open>
            <summary>Why this matters</summary>
            <div id="tp-why">{step?.whyMatters || "This step mirrors live warehouse / OMS work."}</div>
          </details>
        </div>

        <div className="feedback-msg" id="tp-feedback" />
      </div>

      <div className="train-panel-actions">
        <button type="button" className="btn btn-amber" id="tp-hint" onClick={showHint}>
          Hint
        </button>
        <button type="button" className="btn btn-blue" id="tp-show" onClick={showMe}>
          Show me
        </button>
        <button type="button" className="btn btn-ghost" id="tp-skip" onClick={closeTour} aria-label="Close">
          Close
        </button>
      </div>
    </aside>
  );
}
