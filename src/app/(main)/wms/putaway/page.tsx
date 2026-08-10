"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PutawayTour } from "@/features/wms/inward/putaway/tour-config";

export default function PutawayPage() {
  const { startTraining } = useTrainingContext();
  const [tab, setTab] = useState("bin-putaway");

  const tabs = [
    { id: "bin-putaway", label: "Bin Putaway" },
    { id: "bin-transfer", label: "Bin Transfer" },
    { id: "item-putaway", label: "Item Putaway" },
  ];

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(PutawayTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Put Away" }]} />
      <div className="product-page-body p-5">
        <div className="max-w-3xl">
          {/* Tabs */}
          <div id="putaway-tabs" className="flex gap-0 mb-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 bg-transparent border-none border-b-2 text-xs font-semibold -mb-px cursor-pointer ${
                  tab === t.id
                    ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t"
                    : "text-slate-400 border-b-transparent hover:text-blue-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white border border-slate-200 rounded-b rounded-tr p-6">
            {tab === "bin-putaway" && (
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Bin Putaway</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Get Empty Location</label>
                      <input id="bp-get-location" type="text" placeholder="A-12-01" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div id="bp-suggested" className="text-xs text-slate-400 mt-2">Move the putaway bin physically to the suggested empty location.</div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Scan Location ID</label>
                      <input id="bp-location" type="text" placeholder="A-12-04" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Scan Bin ID</label>
                      <input id="bp-bin" type="text" placeholder="BIN-PASS-01" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Confirm Location ID</label>
                      <input id="bp-confirm" type="text" placeholder="A-12-04" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <button id="bp-btn-complete" className="mt-2 h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Complete Bin Putaway</button>
                  </div>
                </div>
              </div>
            )}

            {tab === "bin-transfer" && (
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Bin Transfer</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Get Location with Empty Bin</label>
                      <input id="bt-get-location" type="text" placeholder="B-03-01" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div id="bt-suggested" className="text-xs text-slate-400 mt-2">Move the source putaway bin to the suggested destination.</div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Destination Bin ID</label>
                      <input id="bt-dest" type="text" placeholder="BIN-DEST-07" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Source Bin ID</label>
                      <input id="bt-source" type="text" placeholder="BIN-PASS-01" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Confirm Destination Bin</label>
                      <input id="bt-confirm" type="text" placeholder="BIN-DEST-07" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <button id="bt-btn-complete" className="mt-2 h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Complete Transfer</button>
                  </div>
                </div>
              </div>
            )}

            {tab === "item-putaway" && (
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Item Putaway</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Scan Bin ID</label>
                      <input id="ip-bin" type="text" placeholder="BIN-DEST-07" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div id="ip-status" className="flex items-center text-xs text-slate-400 min-h-8">Bin status will appear here</div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-700">Item Code</label>
                      <input id="ip-item" type="text" placeholder="ITM-567890" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                    </div>
                    <button id="ip-btn-complete" className="mt-2 h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Put Away Item</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
