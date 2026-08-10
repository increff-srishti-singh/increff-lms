"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { ReceiveBoxesTour } from "@/features/wms/inward/receive-boxes/tour-config";
import { withStartTour } from "@/shared/lib/tour-registry";

export default function ReceiveBoxesPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(ReceiveBoxesTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Receive Inward Boxes" }]} />
      <div className="product-page-body p-5">
        <div className="max-w-2xl">
          <div className="bg-white border border-slate-200 rounded p-6">
            {/* Toggle */}
            <div className="flex items-center gap-2.5 mb-6 text-xs text-slate-700 cursor-pointer select-none">
              <label className="relative inline-flex items-center cursor-pointer">
                <input id="receive-external-toggle" type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5.5 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-[18px]" />
              </label>
              <span>Use External Box Codes</span>
            </div>

            {/* Gate Entry ID */}
            <div className="max-w-[420px]">
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">Gate Entry ID *</label>
                <input id="receive-gate-entry-id" type="text" placeholder="e.g. GE-10042" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                <span className="text-[12px] text-slate-400">Enter the Gate Entry to receive boxes for.</span>
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">No. of Boxes *</label>
                <input id="receive-no-boxes" type="number" max={500} placeholder="e.g. 3" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                <span className="text-[12px] text-slate-400">Max. Limit: 500 per batch.</span>
              </div>
              <div className="mb-4">
                <button id="receive-btn-print" className="h-8 px-4 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Print Boxes</button>
              </div>
            </div>

            {/* Boxes table */}
            <div id="receive-boxes-table" className="bg-white border border-slate-200 rounded overflow-auto mb-4">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {["Box Code", "Gate Entry ID", "Status", "Received At"].map((h) => (
                      <th key={h} className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="empty-row">
                    <td colSpan={4} className="text-center text-slate-400 py-8 text-sm">Print boxes to see them here</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Confirm */}
            <div>
              <button id="receive-btn-confirm" className="h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Confirm All Received</button>
                <a href={withStartTour("/wms/grn")} className="btn btn-blue ml-2">Next: GRN</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
