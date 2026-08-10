"use client";

import React from "react";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import type { TourConfig } from "@/features/learning/types";

interface ModePickerProps {
  config: TourConfig;
  onContinue: (mode: "watch" | "practice") => void;
  onCancel: () => void;
}

export function ModePicker({ config, onContinue, onCancel }: ModePickerProps) {
  const { mode, setMode } = useTrainingStore();

  return (
    <div className="train-full-overlay fixed inset-0 z-[1000000020] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#0e0f0c]/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-2xl border border-white/50 p-6 animate-scale-in">
        <div className="text-center mb-6">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#d4d7d0] text-[#2a2b28] mb-3">
            Step 1
          </span>
          <h2 className="text-2xl font-extrabold text-[#0e0f0c] tracking-tight mb-1">How do you want to learn?</h2>
          <p className="text-sm text-[#6b6d6a]">Watch for first exposure. Practice to try it yourself.</p>
          {config.parentModuleName && (
            <p className="text-xs font-semibold text-[#1a73e8] mt-2">{config.parentModuleName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key: "watch" as const, icon: "▶", title: "Watch", desc: "We highlight and auto-fill fields." },
            { key: "practice" as const, icon: "✎", title: "Practice", desc: "Required = any value. Optional = skip OK." },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMode(opt.key)}
              className={`rounded-xl p-4 text-left transition-all duration-200 ${
                mode === opt.key
                  ? "bg-[#9fe870] ring-2 ring-[#9fe870]"
                  : "bg-[#d4d7d0] hover:bg-[#dde0da]"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center text-sm font-bold text-[#0e0f0c] mb-2">
                {opt.icon}
              </div>
              <h4 className="text-sm font-bold text-[#0e0f0c] mb-0.5">{opt.title}</h4>
              <p className="text-xs text-[#2a2b28]">{opt.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="h-10 px-4 rounded-xl bg-[#d4d7d0] text-[#2a2b28] text-sm font-semibold hover:bg-[#dde0da] transition-all duration-150">
            Cancel
          </button>
          <button onClick={() => onContinue(mode)} className="h-10 px-5 rounded-xl bg-[#0e0f0c] text-white text-sm font-semibold hover:bg-[#2a2b28] transition-all duration-150">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
