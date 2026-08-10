"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { ManifestTour } from "@/features/wms/b2c/packing/tour-config";
import { withStartTour } from "@/shared/lib/tour-registry";

export default function ManifestsPage() {
  const { startTraining } = useTrainingContext();
  const [tab, setTab] = useState("create");

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(ManifestTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Manifests" }]} />
      <div className="product-page-body p-5">
        <div className="max-w-3xl">
          {/* Tabs */}
          <div id="manifest-tabs" className="flex gap-0 mb-4">
            <button
              id="tab-manifest-create"
              onClick={() => setTab("create")}
              className={`px-4 py-2.5 text-xs font-semibold border-none border-b-2 -mb-px cursor-pointer ${
                tab === "create" ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t" : "text-slate-400 border-b-transparent bg-transparent hover:text-blue-600"
              }`}
            >
              Create Manifest
            </button>
            <button
              onClick={() => setTab("search")}
              className={`px-4 py-2.5 text-xs font-semibold border-none border-b-2 -mb-px cursor-pointer ${
                tab === "search" ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t" : "text-slate-400 border-b-transparent bg-transparent hover:text-blue-600"
              }`}
            >
              Search Manifest
            </button>
          </div>

          {tab === "create" && (
            <div className="bg-white border border-slate-200 rounded p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Client *</label>
                  <select id="mf-client" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="retailcorp">RetailCorp India</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Channel *</label>
                  <select id="mf-channel" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="amazon">Amazon</option>
                    <option value="flipkart">Flipkart</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Transporter *</label>
                  <select id="mf-transporter" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="delhivery">Delhivery</option>
                    <option value="bluedart">BlueDart</option>
                  </select>
                </div>
              </div>
              <button id="mf-btn-create" className="h-8 px-4 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Create Manifest</button>

              <div className="text-xs text-slate-700 my-3">Manifest meta will appear here after creation (ID + Status)</div>

              <div className="flex flex-col gap-1 mb-4 max-w-[400px]">
                <label className="text-xs font-semibold text-slate-700">Scan AWB</label>
                <input id="mf-awb" type="text" placeholder="e.g. AWB77821001" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
              </div>

              <div id="mf-close-print" className="flex gap-2 items-end flex-wrap">
                <button id="mf-btn-close" className="h-8 px-4 rounded bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600">Close Manifest</button>
                <button id="mf-btn-print" className="h-8 px-4 rounded border border-blue-600 bg-white text-blue-600 text-xs font-semibold hover:bg-blue-50">Print Manifest</button>
              </div>

              <div className="mt-4">
                <a id="mf-link-handover" href={withStartTour("/wms/handover")} className="btn btn-blue">Next: Handover</a>
              </div>
            </div>
          )}

          {tab === "search" && (
            <div className="bg-white border border-slate-200 rounded p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">External ID</label>
                  <input type="text" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Internal Manifest ID</label>
                  <input type="text" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-end">
                  <button className="h-8 px-4 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Search</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
