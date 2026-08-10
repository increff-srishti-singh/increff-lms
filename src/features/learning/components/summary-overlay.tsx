"use client";

import React from "react";
import type { TourConfig } from "@/features/learning/types";
import { getSupport } from "@/shared/lib/curriculum";

interface SummaryOverlayProps {
  config: TourConfig;
  continueLabel?: string;
  onContinueLearning: () => void;
  onStartOver: () => void;
  onTakeQuiz: () => void;
}

export function SummaryOverlay({
  config,
  continueLabel = "Continue learning",
  onContinueLearning,
  onStartOver,
  onTakeQuiz,
}: SummaryOverlayProps) {
  const support = getSupport(config.track);
  const s = config.summary;

  return (
    <div className="train-full-overlay fixed inset-0 z-[1000000020] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#0e0f0c]/30 backdrop-blur-sm" />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl border border-white/50 p-6 animate-scale-in">
        <div className="text-center mb-4">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#9fe870] text-[#0e0f0c] mb-3">
            Module complete
          </span>
          <h2 className="text-xl font-extrabold text-[#0e0f0c] tracking-tight">{s.title}</h2>
          <p className="text-sm text-[#6b6d6a] mt-1">{s.intro}</p>
        </div>

        {/* 3 action buttons on top */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            type="button"
            onClick={onStartOver}
            className="h-10 px-2 rounded-xl bg-[#d4d7d0] text-[#0e0f0c] text-xs font-semibold hover:bg-[#dde0da] transition-all duration-150"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={onContinueLearning}
            className="h-10 px-2 rounded-xl bg-[#9fe870] text-[#0e0f0c] text-xs font-semibold hover:bg-[#cdffad] transition-all duration-150"
          >
            {continueLabel}
          </button>
          <button
            type="button"
            onClick={onTakeQuiz}
            className="h-10 px-2 rounded-xl bg-[#0e0f0c] text-white text-xs font-semibold hover:bg-[#2a2b28] transition-all duration-150"
          >
            Take optional quiz
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#d4d7d0] rounded-xl p-3.5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6d6a] mb-2">What you learned</h4>
            <ul className="text-xs space-y-1.5 text-[#2a2b28]">
              {s.takeaways.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#1a73e8] mt-0.5">→</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#d4d7d0] rounded-xl p-3.5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6d6a] mb-2">Remember on the floor</h4>
            <ul className="text-xs space-y-1.5 text-[#2a2b28]">
              {s.recap.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#1a73e8] mt-0.5">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[#eff6ff] rounded-xl p-3.5 mb-3 border border-[#bfdbfe]">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1e3a5f] mb-2">Common errors to avoid</h4>
          <ul className="text-xs space-y-1 text-[#1e3a5f]">
            {config.pitfalls.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#d4d7d0] rounded-xl p-3.5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6d6a] mb-2">Who to contact if confused</h4>
          {support.contacts.map((c, i) => (
            <div key={i} className="bg-white rounded-lg p-2.5 mb-1.5 text-xs border border-[#d4d7d0] last:mb-0">
              <div className="font-bold text-[#0e0f0c]">{c.role}</div>
              <div className="text-[#6b6d6a] mt-0.5">{c.name}</div>
              <div className="text-[#6b6d6a] text-[11px]">{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
