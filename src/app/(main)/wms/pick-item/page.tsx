"use client";

import { Fragment } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PickItemTour } from "@/features/wms/b2c/picking/tour-config";
import { withStartTour } from "@/shared/lib/tour-registry";

export default function PickItemPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(PickItemTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Piece Pick Item" }]} />
      <div className="product-page-body p-5">
        <div className="max-w-[480px]">
          <div className="flex items-center gap-2.5 mb-4 text-xs text-slate-700 cursor-pointer select-none">
            <label className="relative inline-flex items-center cursor-pointer">
              <input id="ppi-express-toggle" type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5.5 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-[18px]" />
            </label>
            <span>Express Picking</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Scan Location ID</label>
              <input id="ppi-location" type="text" placeholder="e.g. A-12-04" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
            </div>
            <div id="ppi-attrs" className="grid grid-cols-[140px_1fr] gap-2 my-2 mb-4">
              {[
                { label: "Pack Type", value: "—" },
                { label: "Aisle", value: "—" },
                { label: "Location ID", value: "—" },
                { label: "Bin ID", value: "—" },
                { label: "Increff SKU ID", value: "—" },
                { label: "Client SKU ID", value: "—" },
                { label: "Order Type", value: "—" },
              ].map((attr) => (
                <Fragment key={attr.label}>
                  <dt className="text-xs text-slate-400 font-medium border-b border-slate-100 py-1.5">{attr.label}</dt>
                  <dd className="text-xs text-slate-700 font-semibold border-b border-slate-100 py-1.5 m-0">{attr.value}</dd>
                </Fragment>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Scan Item Code</label>
              <input id="ppi-item-code" type="text" placeholder="e.g. ITM-441001" className="h-8 px-2.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
            </div>
            <div id="ppi-actions" className="flex gap-2 mt-2">
              <button id="ppi-btn-pick" className="h-8 px-4 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Confirm Pick</button>
              <button className="h-8 px-4 rounded border border-red-400 bg-white text-red-500 text-xs font-semibold hover:bg-red-50">Not Found</button>
              <a href={withStartTour("/wms/packing")} className="btn btn-blue ml-auto">Next: Packing</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
