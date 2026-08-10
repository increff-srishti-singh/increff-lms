"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PackingTour } from "@/features/wms/b2c/packing/tour-config";
import { withStartTour } from "@/shared/lib/tour-registry";

export default function PackingPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(PackingTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Piece Packing" }]} />
      <div className="product-page-body p-5">
        <div className="max-w-[720px]">
          <div className="grid grid-cols-2 gap-6 max-w-[720px] mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Item Code</label>
              <input id="pack-item-code" type="text" placeholder="e.g. ITM-441001" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
            </div>
          </div>

          <div id="pack-status-panel" className="mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs grid gap-1.5 max-w-[520px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Items Scanned</span>
              <span className="font-semibold text-slate-700">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-slate-700">1</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <button id="pack-btn-complete" disabled className="h-8 px-4 rounded bg-green-600/50 text-white text-xs font-semibold cursor-not-allowed">Complete Packing</button>
            <button id="pack-btn-print" className="h-8 px-4 rounded border border-green-600 bg-white text-green-600 text-xs font-semibold hover:bg-green-50">Print Invoice & Label</button>
            <button className="h-8 px-4 rounded border border-red-400 bg-white text-red-500 text-xs font-semibold hover:bg-red-50">Mark QC Fail</button>
          </div>

          <div className="flex flex-col gap-1 mt-4 max-w-[520px]">
            <label className="text-xs font-medium text-slate-700">Scan AWB</label>
            <input id="pack-awb" type="text" placeholder="e.g. AWB77821001" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
          </div>

          <div className="mt-4">
            <a id="pack-link-manifest" href={withStartTour("/wms/manifests")} className="btn btn-blue">Next: Manifest</a>
          </div>
        </div>
      </div>
    </>
  );
}
