"use client";

import React from "react";
import { GLOSSARY } from "@/shared/lib/curriculum";

export function GlossaryDrawer() {
  return (
    <div className="fixed bottom-6 left-6 z-[10050]">
      <button
        type="button"
        id="glossary-toggle"
        className="bg-white/80 backdrop-blur-xl rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-white/50 px-4 h-10 text-xs font-bold text-[#2a2b28] hover:bg-white hover:text-[#0e0f0c] transition-all duration-150"
        onClick={() => {
          const panel = document.getElementById("glossary-panel");
          if (panel) panel.classList.toggle("hidden");
        }}
      >
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            <line x1="8" y1="7" x2="16" y2="7" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          Glossary
        </span>
      </button>
      <div
        id="glossary-panel"
        className="hidden absolute bottom-[52px] left-0 w-80 max-h-80 overflow-y-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 p-4"
      >
        <h4 className="text-xs font-bold text-[#0e0f0c] mb-3 uppercase tracking-[0.06em]">Key terms</h4>
        <dl className="space-y-2">
          {Object.entries(GLOSSARY).map(([term, def]) => (
            <div key={term} className="pb-2 border-b border-[#d4d7d0] last:border-0 last:pb-0">
              <dt className="text-xs font-bold text-[#0e0f0c]">{term}</dt>
              <dd className="text-xs text-[#6b6d6a] mt-0.5 leading-relaxed">{def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
