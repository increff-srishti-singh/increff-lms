"use client";

import React, { useState } from "react";
import type { Scenario } from "@/features/learning/types";

interface ScenarioPickerProps {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
  onCancel: () => void;
}

export function ScenarioPicker({ scenarios, onSelect, onCancel }: ScenarioPickerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="train-full-overlay fixed inset-0 z-[1000000020] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#0e0f0c]/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-2xl border border-white/50 p-6 animate-scale-in">
        <div className="text-center mb-6">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#d4d7d0] text-[#2a2b28] mb-3">
            Step 2
          </span>
          <h2 className="text-2xl font-extrabold text-[#0e0f0c] tracking-tight mb-1">Pick a scenario</h2>
          <p className="text-sm text-[#6b6d6a]">Keeps the clicks purposeful.</p>
        </div>

        <div className="space-y-2 mb-6">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelectedIdx(i)}
              className={`w-full text-left rounded-xl p-3.5 transition-all duration-200 ${
                i === selectedIdx
                  ? "bg-[#9fe870] ring-2 ring-[#9fe870]"
                  : "bg-[#d4d7d0] hover:bg-[#dde0da]"
              }`}
            >
              <h4 className="text-sm font-bold text-[#0e0f0c]">{s.title}</h4>
              <p className="text-xs text-[#2a2b28] mt-0.5">{s.story}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="h-10 px-4 rounded-xl bg-[#d4d7d0] text-[#2a2b28] text-sm font-semibold hover:bg-[#dde0da] transition-all duration-150">
            Cancel
          </button>
          <button onClick={() => onSelect(scenarios[selectedIdx])} className="h-10 px-5 rounded-xl bg-[#0e0f0c] text-white text-sm font-semibold hover:bg-[#2a2b28] transition-all duration-150">
            Start module
          </button>
        </div>
      </div>
    </div>
  );
}
