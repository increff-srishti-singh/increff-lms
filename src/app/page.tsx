"use client";

import { useProgressStore } from "@/shared/stores/progress-store";
import { MODULES } from "@/shared/lib/curriculum";
import { withStartTour } from "@/shared/lib/tour-registry";
import Link from "next/link";
import { useMemo } from "react";

function ProgressRing({ pct }: { pct: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-[140px] h-[140px] shrink-0">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e8ebe4" strokeWidth="12" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#9fe870"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-[#0e0f0c] tracking-tight">{pct}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b6d6a]">Progress</span>
      </div>
    </div>
  );
}

function ModuleCard({
  mod,
  index,
  isDone,
}: {
  mod: (typeof MODULES)[number];
  index: number;
  isDone: boolean;
}) {
  return (
    <Link
      href={withStartTour(mod.href)}
      className={`group relative flex flex-col bg-white rounded-[20px] border p-6 transition-all duration-200 ${
        isDone
          ? "border-[#9fe870]/80 shadow-[0_8px_28px_rgba(159,232,112,0.12)]"
          : "border-[#e4e7e0] shadow-[0_4px_20px_rgba(14,15,12,0.04)] hover:border-[#c5edab] hover:shadow-[0_12px_32px_rgba(14,15,12,0.08)] hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
            isDone ? "bg-[#9fe870] text-[#0e0f0c]" : "bg-[#eef0eb] text-[#6b6d6a] group-hover:bg-[#e2f6d5] group-hover:text-[#163300]"
          }`}
        >
          {isDone ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            index
          )}
        </span>
        {isDone && (
          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#163300] bg-[#e2f6d5] px-2.5 py-1 rounded-full">
            Done
          </span>
        )}
      </div>

      <h3 className="text-[17px] font-bold text-[#0e0f0c] tracking-tight mb-2 group-hover:text-[#163300]">
        {mod.title}
      </h3>
      <p className="text-[13px] text-[#6b6d6a] leading-relaxed flex-1">{mod.description}</p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#eef0eb]">
        <span className="text-[12px] text-[#9a9c98] font-medium">{mod.duration}</span>
        <span className="text-[12px] font-semibold text-[#0e0f0c] opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          Start →
        </span>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const hydrated = useProgressStore((s) => s._hasHydrated);
  const modules = useProgressStore((s) => s.modules);

  const completedCount = useMemo(
    () => (hydrated ? MODULES.filter((m) => modules[m.id]?.completed).length : 0),
    [modules, hydrated]
  );
  const totalModules = MODULES.length;
  const pct = Math.round((completedCount / Math.max(totalModules, 1)) * 100);

  const wmsMods = MODULES.filter((m) => m.track === "WMS");
  const omsMods = MODULES.filter((m) => m.track === "OMS");
  const wmsDone = hydrated ? wmsMods.filter((m) => modules[m.id]?.completed).length : 0;
  const omsDone = hydrated ? omsMods.filter((m) => modules[m.id]?.completed).length : 0;
  const nextMod = wmsMods.find((m) => !(hydrated && modules[m.id]?.completed)) || omsMods.find((m) => !(hydrated && modules[m.id]?.completed)) || wmsMods[0];

  const wmsPct = Math.round((wmsDone / Math.max(wmsMods.length, 1)) * 100);
  const omsPct = Math.round((omsDone / Math.max(omsMods.length, 1)) * 100);

  return (
    <div className="min-h-screen bg-[#f3f4f1]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(159,232,112,0.22), transparent 42%), radial-gradient(circle at 88% 0%, rgba(14,15,12,0.04), transparent 36%)",
        }}
      />

      <div className="relative px-5 sm:px-8 lg:px-12 py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#9fe870] flex items-center justify-center font-extrabold text-lg text-[#0e0f0c] shadow-[0_6px_18px_rgba(159,232,112,0.35)]">
                  I
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6d6a]">Increff Training</p>
                  <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0e0f0c] tracking-tight leading-none">
                    Dashboard
                  </h1>
                </div>
              </div>
              <p className="text-sm text-[#6b6d6a] sm:ml-[52px]">
                Your module progress and readiness across WMS and OMS.
              </p>
            </div>

            <Link
              href={withStartTour(nextMod.href)}
              className="inline-flex items-center justify-center h-11 px-5 rounded-2xl bg-[#0e0f0c] text-white text-sm font-semibold hover:bg-[#2a2b28] transition-colors shadow-[0_8px_24px_rgba(14,15,12,0.18)]"
            >
              Continue training
            </Link>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            <div className="lg:col-span-1 bg-white rounded-[24px] border border-[#e4e7e0] shadow-[0_8px_28px_rgba(14,15,12,0.04)] p-6 flex items-center gap-5">
              <ProgressRing pct={pct} />
              <div>
                <h2 className="text-sm font-bold text-[#0e0f0c] mb-1">Overall progress</h2>
                <p className="text-[13px] text-[#6b6d6a] leading-relaxed mb-3">
                  {completedCount} of {totalModules} modules complete.
                </p>
                <p className="text-[12px] font-semibold text-[#163300] bg-[#e2f6d5] inline-flex px-2.5 py-1 rounded-full">
                  {pct >= 50 ? "Great — keep going!" : "Start with Gate Entry"}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#e4e7e0] shadow-[0_8px_28px_rgba(14,15,12,0.04)] p-6">
              <h2 className="text-sm font-bold text-[#0e0f0c] mb-4">Progress by track</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="rounded-2xl bg-[#1d4ed8] text-white p-4">
                  <div className="text-[28px] font-extrabold tracking-tight leading-none mb-1">{wmsPct}%</div>
                  <div className="text-[12px] font-medium text-white/80">Warehouse (WMS) · {wmsDone}/{wmsMods.length}</div>
                </div>
                <div className="rounded-2xl bg-[#0e0f0c] text-white p-4">
                  <div className="text-[28px] font-extrabold tracking-tight leading-none mb-1">{omsPct}%</div>
                  <div className="text-[12px] font-medium text-white/70">Order Mgmt (OMS) · {omsDone}/{omsMods.length}</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "WMS path", pct: wmsPct, color: "#1d4ed8" },
                  { label: "OMS path", pct: omsPct, color: "#0e0f0c" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-[11px] font-semibold text-[#6b6d6a] mb-1.5">
                      <span>{row.label}</span>
                      <span>{row.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#eef0eb] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${row.pct}%`, background: row.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6d6a]">
                <span className="w-2 h-2 rounded-full bg-[#9fe870]" />
                Warehouse Management
              </span>
              <div className="h-px flex-1 bg-[#dde0da]" />
              <span className="text-[11px] font-semibold text-[#9a9c98]">{wmsDone}/{wmsMods.length} done</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wmsMods.map((mod, i) => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  index={i + 1}
                  isDone={hydrated && !!modules[mod.id]?.completed}
                />
              ))}
            </div>
          </section>

          <section className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6d6a]">
                <span className="w-2 h-2 rounded-full bg-[#1d4ed8]" />
                Order Management
              </span>
              <div className="h-px flex-1 bg-[#dde0da]" />
              <span className="text-[11px] font-semibold text-[#9a9c98]">{omsDone}/{omsMods.length} done</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {omsMods.map((mod, i) => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  index={wmsMods.length + i + 1}
                  isDone={hydrated && !!modules[mod.id]?.completed}
                />
              ))}
            </div>
          </section>

          <div className="mt-4 rounded-[24px] bg-[#0e0f0c] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_16px_40px_rgba(14,15,12,0.2)]">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Jump back in</h3>
              <p className="text-sm text-[#9a9c98] mt-1">
                Next up: <span className="text-[#9fe870] font-semibold">{nextMod.title}</span>
              </p>
            </div>
            <Link
              href={withStartTour(nextMod.href)}
              className="h-11 px-6 rounded-2xl bg-[#9fe870] text-[#0e0f0c] text-sm font-bold inline-flex items-center justify-center hover:bg-[#cdffad] transition-colors"
            >
              Open module
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
