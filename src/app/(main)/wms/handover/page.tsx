"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { HandoverTour } from "@/features/wms/b2c/packing/tour-config";

export default function HandoverPage() {
  const { startTraining } = useTrainingContext();
  const [mode, setMode] = useState("manifest");

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(HandoverTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Piece Order Handover" }]} />
      <div className="product-page-body p-5">
        <div className="max-w-3xl">
          {/* Mode tabs */}
          <div id="ho-mode-tabs" className="flex gap-0 mb-4">
            <button
              id="tab-ho-manifest"
              onClick={() => setMode("manifest")}
              className={`px-4 py-2.5 text-xs font-semibold border-none border-b-2 -mb-px cursor-pointer ${
                mode === "manifest" ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t" : "text-slate-400 border-b-transparent bg-transparent hover:text-blue-600"
              }`}
            >
              By Manifest ID
            </button>
            <button
              id="tab-ho-awb"
              onClick={() => setMode("awb")}
              className={`px-4 py-2.5 text-xs font-semibold border-none border-b-2 -mb-px cursor-pointer ${
                mode === "awb" ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t" : "text-slate-400 border-b-transparent bg-transparent hover:text-blue-600"
              }`}
            >
              By Individual AWBs
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded p-6">
            {mode === "manifest" && (
              <div className="max-w-[400px]">
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-xs font-semibold text-slate-700">Internal Manifest ID</label>
                  <input id="ho-manifest-id" type="text" placeholder="e.g. MF-10088" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
                </div>
                <button id="ho-btn-load-manifest" className="h-8 px-4 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Load Manifest</button>
              </div>
            )}

            {mode === "awb" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Client</label>
                  <select className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="retailcorp">RetailCorp India</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Channel</label>
                  <select className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Transporter</label>
                  <select className="h-8 px-2.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="delhivery">Delhivery</option>
                  </select>
                </div>
              </div>
            )}

            {/* Handover table */}
            <div id="ho-table" className="bg-white border border-slate-200 rounded overflow-auto mt-6">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {["Order ID", "AWB No.", "Transporter"].map((h) => (
                      <th key={h} className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="empty-row">
                    <td colSpan={3} className="text-center text-slate-400 py-8 text-sm">Load a manifest to see orders</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Remove AWB */}
            <div id="ho-remove-awb" className="flex flex-col gap-1 max-w-[400px] mt-4">
              <label className="text-xs font-medium text-slate-700">Scan AWB to Remove (rejected pickups)</label>
              <input className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" placeholder="Scan AWB..." />
            </div>

            <div className="mt-4">
              <button id="ho-btn-confirm" className="h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Confirm Handover</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
