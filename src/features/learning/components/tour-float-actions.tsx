"use client";

import React from "react";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useTrainingContext } from "@/providers/training-provider";
import { getTourByPageKey } from "@/shared/lib/tour-registry";

export function TourFloatActions() {
  const hasHydrated = useCheckpointStore((s) => s._hasHydrated);
  const pageKey = useCheckpointStore((s) => s.pageKey);
  const stepIndex = useCheckpointStore((s) => s.stepIndex);
  const title = useCheckpointStore((s) => s.title);
  const phase = useTrainingStore((s) => s.phase);
  const { continueFromCheckpoint, startOverFromCheckpoint } = useTrainingContext();

  const config = getTourByPageKey(pageKey);

  // Wait for persist rehydrate; hide during active tour / summary / quiz / pickers
  if (
    !hasHydrated ||
    phase === "active" ||
    phase === "summary" ||
    phase === "quiz" ||
    phase === "mode-picker" ||
    phase === "path-picker" ||
    phase === "scenario-picker" ||
    !pageKey ||
    !config
  )
    return null;

  return (
    <div className="fixed bottom-6 right-6 z-[10060] animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 p-3 min-w-[200px]">
        <div className="text-[10px] font-bold text-[#6b6d6a] uppercase tracking-[0.06em] mb-2">
          Paused · Step {stepIndex + 1}
          {title ? ` · ${title}` : ""}
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={continueFromCheckpoint}
            className="block w-full h-9 rounded-xl bg-[#9fe870] text-[#0e0f0c] text-xs font-semibold flex items-center justify-center hover:bg-[#cdffad] transition-all duration-150"
          >
            Continue demo
          </button>
          <button
            type="button"
            onClick={startOverFromCheckpoint}
            className="block w-full h-9 rounded-xl bg-[#d4d7d0] text-[#2a2b28] text-xs font-semibold flex items-center justify-center hover:bg-[#dde0da] transition-all duration-150"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
