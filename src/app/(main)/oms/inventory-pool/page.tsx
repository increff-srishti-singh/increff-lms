"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { InventoryPoolTour } from "@/features/oms/inventory-pool/tour-config";
import { showToast } from "@/shared/lib/tour-utils";

const CLIENTS = [
  { value: "test11", label: "Test11" },
  { value: "abc-fashion", label: "ABC Fashion" },
];

const LOCATIONS = [
  { value: "demo-central-warehouse", label: "Demo Central Warehouse" },
  { value: "tested512", label: "tested512" },
];

interface PoolRow {
  id: string;
  name: string;
  type: "COMMON" | "RESERVED";
  location: string;
}

/** Every client + fulfillment location starts with exactly one Common Pool, created automatically. */
const SEED_POOLS: PoolRow[] = [
  { id: "demo-central-warehouse", name: "Common Pool", type: "COMMON", location: "Demo Central Warehouse" },
];

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function selectText(id: string) {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  if (!el || !el.value) return "";
  return el.options[el.selectedIndex]?.text || "";
}

export default function OmsInventoryPoolPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(InventoryPoolTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Create Inventory Pool" }]} />
      <div className="product-page-body p-5">
        <OmsInventoryPoolContent />
      </div>
    </>
  );
}

function OmsInventoryPoolContent() {
  const [pools, setPools] = useState<PoolRow[]>(SEED_POOLS);

  const handleSubmit = () => {
    const locationId = (document.getElementById("pool-location") as HTMLSelectElement | null)?.value;
    const locationLabel = selectText("pool-location");
    const name = inputValue("pool-name");

    if (!locationId) {
      showToast("Select a Fulfillment Location");
      return;
    }
    if (!name) {
      showToast("Enter a Pool Name");
      return;
    }

    setPools((prev) => [...prev, { id: `${locationId}-${prev.length}`, name, type: "RESERVED", location: locationLabel }]);
    showToast("Inventory pool created successfully");
    (document.getElementById("pool-name") as HTMLInputElement | null)!.value = "";
  };

  return (
    <div className="max-w-2xl">
      <div className="grid grid-cols-[220px_1fr] gap-y-5 items-center max-w-[520px]">
        <label className="text-[14px] font-semibold text-slate-800">Client</label>
        <select
          id="pool-client"
          defaultValue="test11"
          className="h-9 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 max-w-[280px]"
        >
          {CLIENTS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <label className="text-[14px] font-semibold text-slate-800">Fulfillment Location</label>
        <select
          id="pool-location"
          defaultValue=""
          className="h-9 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 max-w-[280px]"
        >
          <option value="">Select a Fulfillment Location</option>
          {LOCATIONS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <label className="text-[14px] font-semibold text-slate-800">Name</label>
        <input
          id="pool-name"
          type="text"
          placeholder="Enter Pool Name"
          className="h-9 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500 max-w-[280px]"
        />
      </div>

      <button
        id="pool-btn-submit"
        onClick={handleSubmit}
        className="mt-6 h-9 px-5 rounded border border-blue-500 bg-white text-blue-600 text-[13px] font-semibold hover:bg-blue-50"
      >
        Submit
      </button>

      <div id="pool-existing" className="mt-10">
        <h3 className="text-[14px] font-semibold text-slate-700 mb-3">Existing pools</h3>
        <div id="pool-table" className="border border-slate-200 rounded overflow-auto max-w-[640px]">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Pool Name", "Type", "Fulfillment Location"].map((h) => (
                  <th key={h} className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pools.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2.5 border-b border-slate-100 font-medium">{p.name}</td>
                  <td className="px-3 py-2.5 border-b border-slate-100">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.type === "COMMON" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 border-b border-slate-100">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
