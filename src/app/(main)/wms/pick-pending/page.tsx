"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PickPendingTour } from "@/features/wms/b2c/picking/tour-config";
import { withStartTour } from "@/shared/lib/tour-registry";

export default function PickPendingPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(PickPendingTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Piece Pick Pending" }]} />
      <div className="product-page-body p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
          {/* Main */}
          <div>
            <div className="bg-slate-100 border border-slate-200 rounded p-4 pb-3 mb-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="text-xs font-semibold text-slate-700">Zone *</label>
                  <select id="ppp-zone" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select Zone</option>
                    <option value="ZONE1">ZONE1</option>
                    <option value="ZONE2">ZONE2</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="text-xs font-semibold text-slate-700">Pick Type</label>
                  <select id="ppp-pick-type" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="both">Both</option>
                    <option value="default">Default</option>
                    <option value="express">Express</option>
                  </select>
                </div>
                <div className="flex items-end pb-0">
                  <button id="ppp-btn-search" className="h-8 px-4 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Search</button>
                </div>
              </div>
            </div>
            <div id="ppp-table" className="bg-white border border-slate-200 rounded overflow-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {["Aisle ID", "No. of Items", "Status", "Oldest Pick List", "Required By Time"].map((h) => (
                      <th key={h} className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="empty-row">
                    <td colSpan={5} className="text-center text-slate-400 py-8 text-sm">Select zone and search to see pendency</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Zone pendency card */}
          <div id="ppp-zone-card" className="bg-white border border-slate-200 rounded p-3">
            <div className="flex flex-col gap-2 mb-2.5 text-xs">
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-slate-700">Zone</span>
                <span className="text-slate-400">ZONE1</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-slate-700">Total Pending Items</span>
                <span className="text-slate-400">—</span>
              </div>
            </div>
            <span className="inline-flex self-start px-2.5 py-1 rounded text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8]">
              Zone Wise Total Pendency
            </span>
            <a
              id="ppp-link-pick"
              href={withStartTour("/wms/pick-item")}
              className="btn btn-blue block mt-3 w-full no-underline"
            >
              Start picking
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
