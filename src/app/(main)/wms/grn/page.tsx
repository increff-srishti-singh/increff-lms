"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { GrnTour } from "@/features/wms/inward/grn/tour-config";
import { withStartTour } from "@/shared/lib/tour-registry";

export default function GrnPage() {
  const { startTraining } = useTrainingContext();

  const handleBarcodeScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "8901234567890") {
      document.getElementById("grn-item-scan")?.focus();
    }
  };

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(GrnTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "GRN" }]} />
      <div className="product-page-body p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-7 items-start max-w-4xl">
          {/* Main */}
          <div className="bg-white border border-slate-200 rounded p-6">
            <div className="max-w-[520px]">
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">Inward Box Code *</label>
                <input id="grn-inward-box" type="text" placeholder="e.g. IB-10042-001" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">Scan Barcode *</label>
                <input id="grn-barcode-scan" type="text" placeholder="e.g. 8901234567890" onChange={handleBarcodeScan} className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
              </div>

              {/* Attributes readout */}
              <div id="grn-readouts" className="grid grid-cols-3 gap-3 mt-2 mb-4">
                {["Barcode", "Item Code", "Bin ID"].map((label) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label className="text-[12px] text-slate-400">{label}</label>
                    <div className="min-h-9 px-2.5 py-2 border border-slate-200 rounded bg-slate-50 text-xs text-slate-700">—</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">Scan Item ID *</label>
                <input id="grn-item-scan" type="text" placeholder="e.g. ITM-567890" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">QC Fail Reason</label>
                <select id="grn-qc-reason" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                  <option value="">Select reason (if failing)</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Wrong Item">Wrong Item</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div id="grn-print-actions" className="flex gap-2 mb-4">
                <button id="grn-btn-print-pass" className="h-8 px-4 rounded border border-green-600 bg-white text-green-600 text-xs font-semibold hover:bg-green-50">Print QC Pass Bin ID</button>
                <button id="grn-btn-print-fail" className="h-8 px-4 rounded border border-red-400 bg-white text-red-500 text-xs font-semibold hover:bg-red-50">Print QC Fail Bin ID</button>
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-semibold text-slate-700">Scan QC Bin ID *</label>
                <input id="grn-qc-bin" type="text" placeholder="e.g. BIN-PASS-01" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <button id="grn-btn-complete" className="h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Complete Item GRN</button>
                <a href={withStartTour("/wms/putaway")} className="btn btn-blue ml-2">Next: Put Away</a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3 pt-1">
            <button className="flex items-center gap-2 h-9 px-3.5 border border-slate-300 rounded bg-white text-xs font-semibold text-slate-700 cursor-pointer font-inherit hover:border-blue-500 hover:text-blue-600">
              ⚙ Configurations
            </button>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">Table ID</label>
              <input type="text" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
