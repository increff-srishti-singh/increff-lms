"use client";

export function DemoBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[10040] flex items-center justify-center gap-2 h-[48px] bg-[#0e0f0c] text-[#9fe870] text-xs font-medium tracking-wide px-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#9fe870] shadow-[0_0_6px_rgba(159,232,112,0.5)]" />
      <strong className="font-semibold">Training sandbox</strong>
      <span className="text-[#6b6d6a]">— Demo data only</span>
    </div>
  );
}
