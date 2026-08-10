"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { ClientsTour } from "@/features/oms/clients/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

type RoutingAlgo = "MINIMIZE DISTANCE" | "MINIMIZE SHIPMENTS";

interface ClientRow {
  id: string;
  name: string;
  pan: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
  algo: RoutingAlgo;
}

/** Existing client so both tabs have data before the learner creates one. */
const SEED_CLIENT: ClientRow = {
  id: "1200156732",
  name: "Test11",
  pan: "HJDHJ4553L",
  contactName: "Testing",
  contactEmail: "",
  contactNumber: "",
  address: "BENGALURU - 660078, KARNATAKA, INDIA",
  algo: "MINIMIZE SHIPMENTS",
};

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function selectText(id: string) {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  if (!el || !el.value) return "";
  return el.options[el.selectedIndex]?.text || "";
}

export default function OmsClientsPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(ClientsTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Clients" }]} />
      <div className="product-page-body p-5">
        <OmsClientsContent />
      </div>
    </>
  );
}

function OmsClientsContent() {
  const [tab, setTab] = useState("client-details");
  const [clients, setClients] = useState<ClientRow[]>([SEED_CLIENT]);
  /** Row whose algorithm the update modal edits. Tour always targets row 0. */
  const [routingIndex, setRoutingIndex] = useState(0);

  const tabs = [
    { id: "client-details", label: "Client Details" },
    { id: "routing-algorithm", label: "Primary Routing Algorithm" },
  ];

  const routingClient = clients[routingIndex] || clients[0];

  const handleSubmitClient = () => {
    const name = inputValue("client-name") || "ABC Fashion";
    const city = inputValue("client-city");
    const pincode = inputValue("client-pincode");
    const state = selectText("client-state");
    const country = selectText("client-country");
    const address = [city, pincode && `- ${pincode}`, state, country]
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    const created: ClientRow = {
      id: String(1200156733 + clients.length),
      name,
      pan: inputValue("client-pan"),
      contactName: inputValue("client-contact-name"),
      contactEmail: inputValue("client-contact-email"),
      contactNumber: inputValue("client-contact-number"),
      address: address || "—",
      // Every new client starts on the system default until it is configured.
      algo: "MINIMIZE SHIPMENTS",
    };

    setClients((prev) => [created, ...prev]);
    setRoutingIndex(0);
    closeModal("modal-add-client");
    showToast("Client created successfully");
  };

  const handleUpdateAlgo = () => {
    const picked = document.querySelector<HTMLInputElement>(
      'input[name="client-routing-algo"]:checked'
    )?.value;
    if (picked) {
      setClients((prev) =>
        prev.map((c, i) => (i === routingIndex ? { ...c, algo: picked as RoutingAlgo } : c))
      );
    }
    closeModal("modal-routing-algorithm");
    showToast("Primary Routing Algorithm updated");
  };

  return (
    <div className="max-w-6xl">
      {/* Tabs */}
      <div id="clients-tabs" className="flex gap-0 mb-0">
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

      <div className="bg-white border border-slate-200 rounded-b rounded-tr p-5">
        {tab === "client-details" && (
          <>
            {/* Toolbar */}
            <div id="clients-toolbar" className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  id="clients-btn-refresh"
                  className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                >
                  Refresh
                </button>
                <button
                  id="clients-btn-add"
                  onClick={() => document.getElementById("modal-add-client")?.classList.add("open")}
                  className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
                >
                  Add Client
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="clients-find-results"
                  type="text"
                  placeholder="Find in results"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] min-w-[180px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <span id="clients-results-count" className="text-[13px] text-slate-400">
                  Showing {clients.length} results
                </span>
              </div>
            </div>

            {/* Client Details table */}
            <div id="clients-table" className="border border-slate-200 rounded overflow-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    {["Client ID", "Name", "PAN No.", "Contact Details", "Address", "Linked Parties"].map((h) => (
                      <th
                        key={h}
                        className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td className="px-3 py-3 border-b border-slate-100 font-semibold">{c.id}</td>
                      <td className="px-3 py-3 border-b border-slate-100 font-medium">{c.name}</td>
                      <td className="px-3 py-3 border-b border-slate-100">{c.pan || "—"}</td>
                      <td className="px-3 py-3 border-b border-slate-100">
                        <div className="text-[12px] leading-relaxed">
                          <div>Name: {c.contactName || "—"}</div>
                          <div className="text-blue-600">Email: {c.contactEmail}</div>
                          <div>Mobile: {c.contactNumber}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[280px]">
                        {c.address}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100">
                        <div className="text-[12px] leading-relaxed">
                          <div className="text-blue-600">Suppliers</div>
                          <div className="text-blue-600">Customers</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "routing-algorithm" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                id="routing-btn-refresh"
                className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
              >
                Refresh
              </button>
              <div className="flex items-center gap-3">
                <input
                  id="routing-find-results"
                  type="text"
                  placeholder="Find in results"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] min-w-[180px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <span className="text-[13px] text-slate-400">Showing {clients.length} results</span>
              </div>
            </div>

            <div id="routing-table" className="border border-slate-200 rounded overflow-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    {["Client ID", "Name", "Primary Routing Algorithm"].map((h) => (
                      <th
                        key={h}
                        className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c, i) => (
                    <tr
                      key={c.id}
                      id={`routing-row-${i}`}
                      onClick={() => {
                        setRoutingIndex(i);
                        document.getElementById("modal-routing-algorithm")?.classList.add("open");
                      }}
                      className="cursor-pointer hover:bg-slate-50"
                      title="Click to update the routing algorithm"
                    >
                      <td className="px-3 py-3 border-b border-slate-100 font-semibold">{c.id}</td>
                      <td className="px-3 py-3 border-b border-slate-100 font-medium">{c.name}</td>
                      <td className="px-3 py-3 border-b border-slate-100 font-semibold">{c.algo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add New Client modal */}
      <div
        id="modal-add-client"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-client-panel" className="bg-white rounded w-full max-w-[920px] shadow-xl relative">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">Add New Client</h3>
            <button
              type="button"
              onClick={() => closeModal("modal-add-client")}
              className="bg-none border-none text-[22px] text-slate-400 cursor-pointer p-0.5 hover:text-slate-700"
            >
              &times;
            </button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
              <div id="field-client-name" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="client-name"
                  type="text"
                  placeholder="Enter Client Name"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
              <div id="field-client-pan" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  PAN No. <span className="text-red-500">*</span>
                </label>
                <input
                  id="client-pan"
                  type="text"
                  placeholder="PAN No."
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div id="field-perishable">
              <h4 className="text-[13px] font-semibold text-slate-500 mb-2">Client Configurations</h4>
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input id="client-perishable" type="checkbox" className="accent-blue-600" />
                Mark as Perishable
              </label>
            </div>

            <div id="field-pack-box">
              <h4 className="text-[13px] font-semibold text-slate-500 mb-2">Pack Box Attributes</h4>
              <div className="flex flex-wrap gap-6">
                {[
                  { id: "client-box-dimensions", label: "Capture Box Dimensions" },
                  { id: "client-box-sku", label: "Capture Box SKU" },
                  { id: "client-box-weight", label: "Capture Box Weight" },
                ].map((b) => (
                  <label key={b.id} className="flex items-center gap-2 text-[13px] cursor-pointer">
                    <input id={b.id} type="checkbox" className="accent-blue-600" />
                    {b.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-slate-500 mb-2">Contact Details</h4>
              <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                <div id="field-contact-name" className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="client-contact-name"
                    type="text"
                    placeholder="Contact Name"
                    className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                  />
                </div>
                <div id="field-contact-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                  <label className="text-[13px] font-medium text-slate-700">Contact Email / Number</label>
                  <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                    <input
                      id="client-contact-email"
                      type="email"
                      placeholder="Contact Email"
                      className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                    />
                    <input
                      id="client-contact-number"
                      type="tel"
                      placeholder="Contact Number"
                      className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
              <div id="field-address1" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  id="client-address1"
                  type="text"
                  placeholder="Address Line 1"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">Address Line 2</label>
                <input
                  id="client-address2"
                  type="text"
                  placeholder="Address Line 2"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">Area</label>
                <input
                  id="client-area"
                  type="text"
                  placeholder="Area"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
              <div id="field-city" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="client-city"
                  type="text"
                  placeholder="City"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
              <div id="field-pincode" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  id="client-pincode"
                  type="text"
                  placeholder="Pincode"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                />
              </div>
              <div id="field-country" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="client-country"
                  className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                >
                  <option value="">Select Country</option>
                  <option value="IN">India</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
              <div id="field-state" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="client-state"
                  className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="KA">Karnataka</option>
                  <option value="MH">Maharashtra</option>
                  <option value="DL">Delhi</option>
                </select>
              </div>
            </div>
          </div>

          <div id="modal-add-client-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
            <button
              onClick={() => closeModal("modal-add-client")}
              className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="client-btn-submit"
              onClick={handleSubmitClient}
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Update Primary Routing Algorithm modal */}
      <div
        id="modal-routing-algorithm"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-routing-panel" className="bg-white rounded w-full max-w-[560px] shadow-xl relative">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">
              Update Primary Routing Algorithm for Client - {routingClient?.id}
            </h3>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div>
              <div className="text-[13px] font-semibold text-slate-700">Client Name</div>
              <div id="routing-client-name" className="text-[13px] text-slate-500">
                {routingClient?.name}
              </div>
            </div>

            <div>
              <div className="text-[13px] font-semibold text-slate-700 mb-2">Primary Routing Algorithm</div>
              {/* Remount on algo change so the radios reflect the client's saved value. */}
              <div id="routing-radios" key={routingClient?.algo} className="flex flex-wrap gap-6">
                {(["MINIMIZE DISTANCE", "MINIMIZE SHIPMENTS"] as RoutingAlgo[]).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
                    <input
                      type="radio"
                      name="client-routing-algo"
                      value={opt}
                      defaultChecked={opt === routingClient?.algo}
                      className="accent-blue-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div id="modal-routing-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
            <button
              onClick={() => closeModal("modal-routing-algorithm")}
              className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="routing-btn-update"
              onClick={handleUpdateAlgo}
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
