"use client";

import React, { useState } from "react";
import type { PathGroupId } from "@/features/learning/types";
import { PATH_GROUPS, type LearningPathOption } from "@/shared/lib/learning-path";

interface PathPickerProps {
  group: PathGroupId;
  onSelect: (option: LearningPathOption) => void;
  onCancel: () => void;
}

export function PathPicker({ group, onSelect, onCancel }: PathPickerProps) {
  const def = PATH_GROUPS[group];
  const [selectedId, setSelectedId] = useState(def.options[0]?.id || "");

  const selected = def.options.find((o) => o.id === selectedId) || def.options[0];

  return (
    <div className="train-full-overlay fixed inset-0 z-[1000000020] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#0e0f0c]/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-lg shadow-2xl border border-white/50 p-6 animate-scale-in">
        <div className="text-center mb-6">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#d4d7d0] text-[#2a2b28] mb-3">
            Choose path
          </span>
          <h2 className="text-2xl font-extrabold text-[#0e0f0c] tracking-tight mb-1">{def.title}</h2>
          <p className="text-sm text-[#6b6d6a]">{def.intro}</p>
        </div>

        <div className="space-y-2 mb-6">
          {def.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedId(opt.id)}
              className={`w-full rounded-xl p-4 text-left transition-all duration-200 ${
                selectedId === opt.id
                  ? "bg-[#9fe870] ring-2 ring-[#9fe870]"
                  : "bg-[#d4d7d0] hover:bg-[#dde0da]"
              }`}
            >
              <h4 className="text-sm font-bold text-[#0e0f0c] mb-0.5">{opt.title}</h4>
              <p className="text-xs text-[#2a2b28]">{opt.description}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-4 rounded-xl bg-[#d4d7d0] text-[#2a2b28] text-sm font-semibold hover:bg-[#dde0da] transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className="h-10 px-5 rounded-xl bg-[#0e0f0c] text-white text-sm font-semibold hover:bg-[#2a2b28] transition-all duration-150 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
