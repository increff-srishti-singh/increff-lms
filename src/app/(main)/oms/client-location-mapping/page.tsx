"use client";

import { useEffect, useRef, useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { ClientLocationMappingTour } from "@/features/oms/client-location-mapping/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

interface MappingRow {
  id: string;
  client: string;
  location: string;
  locationType: string;
  gstin: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  billingAddress: string;
}

const SEED_MAPPINGS: MappingRow[] = [
  {
    id: "1200091001",
    client: "Test11",
    location: "tested512",
    locationType: "WAREHOUSE",
    gstin: "12345",
    contactName: "Incref.",
    contactEmail: "",
    contactNumber: "",
    billingAddress: "Bellandur, BENGALURU - 560050, KARNATAKA, INDIA",
  },
  {
    id: "1200091002",
    client: "Test11",
    location: "warehousedemo",
    locationType: "WAREHOUSE",
    gstin: "1234567",
    contactName: "werh",
    contactEmail: "",
    contactNumber: "",
    billingAddress: "Bellandur, BENGALURU - 560040, KARNATAKA, INDIA",
  },
];

/** Columns the Download Template CSV expects — 14 fields total. */
const CSV_FIELDS: [string, string, string, string][] = [
  ["clientId", "Integer", "Identify a specific client", "yes"],
  ["fulfillmentLocationId", "Integer", "Identify a specific fulfillment location", "yes"],
  ["gstin", "String", "Goods and Services Tax Identification Number", "yes"],
  ["billingAddressType", "String", "Accept values of Client, Location or Empty", "yes"],
  ["contactName", "String", "Contact Name", "yes"],
  ["contactEmail", "String", "CONTACT EMAIL", "No"],
  ["contactPhone", "String", "Contact Phone", "No"],
  ["street1", "String", "Address Line 1", "yes"],
  ["street2", "String", "Address Line 2", "No"],
  ["street3", "String", "Address Line 3", "No"],
  ["city", "String", "City", "yes"],
  ["pincode", "String", "Pincode", "yes"],
  ["country", "String", "Country", "yes"],
  ["state", "String", "State", "yes"],
];

const CLIENTS = [
  { value: "test11", label: "Test11" },
  { value: "abc-fashion", label: "ABC Fashion" },
];

const LOCATIONS = [
  { value: "tested512", label: "tested512 (WAREHOUSE)" },
  { value: "warehousedemo", label: "warehousedemo (WAREHOUSE)" },
  { value: "demo-central-warehouse", label: "Demo Central Warehouse (WAREHOUSE)" },
];

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function selectText(id: string) {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  if (!el || !el.value) return "";
  return el.options[el.selectedIndex]?.text || "";
}

export default function OmsClientLocationMappingPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(ClientLocationMappingTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Client Fulfillment Location Mapping" }]} />
      <div className="product-page-body p-5">
        <OmsClientLocationMappingContent />
      </div>
    </>
  );
}

function OmsClientLocationMappingContent() {
  const [rows, setRows] = useState<MappingRow[]>(SEED_MAPPINGS);
  const [modalTab, setModalTab] = useState("add-mapping");
  const [fileName, setFileName] = useState("");
  const [showFields, setShowFields] = useState(false);
  // Billing address radio — form-filled keeps the address block editable.
  const [billingMode, setBillingMode] = useState("form");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement | null;
      if (t?.name === "clm-billing-mode") setBillingMode(t.value);
    };
    el.addEventListener("change", onChange);
    return () => el.removeEventListener("change", onChange);
  }, [modalTab]);

  const billingEditable = billingMode === "form";

  const handleSubmit = () => {
    const address = [
      inputValue("clm-address1"),
      inputValue("clm-area"),
      inputValue("clm-city"),
      inputValue("clm-pincode") && `- ${inputValue("clm-pincode")}`,
      selectText("clm-state"),
    ]
      .filter(Boolean)
      .join(", ")
      .toUpperCase();

    const created: MappingRow = {
      id: String(1200091003 + rows.length),
      client: selectText("clm-client") || "Test11",
      location: selectText("clm-location").split(" (")[0] || "New Location",
      locationType:
        document.querySelector<HTMLInputElement>('input[name="clm-loc-type"]:checked')?.value.toUpperCase() ||
        "WAREHOUSE",
      gstin: inputValue("clm-gstin") || "—",
      contactName: billingEditable ? inputValue("clm-contact-name") || "—" : "—",
      contactEmail: billingEditable ? inputValue("clm-contact-email") : "",
      contactNumber: billingEditable ? inputValue("clm-contact-number") : "",
      billingAddress:
        billingMode === "client"
          ? "Same as client address"
          : billingMode === "location"
            ? "Same as fulfillment location address"
            : address || "—",
    };

    setRows((prev) => [created, ...prev]);
    closeModal("modal-add-mapping");
    showToast("Client Fulfillment Location Mapping created successfully");
  };

  const handleUpload = () => {
    closeModal("modal-add-mapping");
    showToast("Bulk upload submitted — mappings will appear once processed");
  };

  const fieldCls = (enabled = true) =>
    `h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500 ${
      enabled ? "bg-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
    }`;

  return (
    <div className="max-w-6xl">
      {/* Filter bar */}
      <div id="clm-filter-bar" className="bg-slate-100 border border-slate-200 rounded p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 min-w-[170px]">
              <label className="text-[12px] font-semibold text-slate-700">Location Type</label>
              <select
                id="clm-location-type"
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="STORE">Store</option>
                <option value="USP">USP</option>
                <option value="WMS2">WMS2</option>
              </select>
            </div>
            <button
              id="clm-btn-search"
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Search
            </button>
            <button
              id="clm-btn-add"
              onClick={() => {
                setModalTab("add-mapping");
                document.getElementById("modal-add-mapping")?.classList.add("open");
              }}
              className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
            >
              Add New Mapping
            </button>
          </div>
          <span id="clm-results-count" className="text-[13px] text-slate-500">
            Showing <strong>{rows.length}</strong> results
          </span>
        </div>
      </div>

      {/* Directory */}
      <div id="clm-results-table" className="bg-white border border-slate-200 rounded overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Client", "Location", "Location Type", "GSTIN", "Contact Details", "Client Billing Address"].map(
                (h) => (
                  <th
                    key={h}
                    className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300 whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-3 border-b border-slate-100 font-medium">{r.client}</td>
                <td className="px-3 py-3 border-b border-slate-100">{r.location}</td>
                <td className="px-3 py-3 border-b border-slate-100">{r.locationType}</td>
                <td className="px-3 py-3 border-b border-slate-100">{r.gstin}</td>
                <td className="px-3 py-3 border-b border-slate-100">
                  <div className="text-[12px] leading-relaxed">
                    <div>Name: {r.contactName || "—"}</div>
                    <div className="text-blue-600">Email: {r.contactEmail}</div>
                    <div>Mobile: {r.contactNumber}</div>
                  </div>
                </td>
                <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[260px]">
                  {r.billingAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Bulk Upload modal */}
      <div
        id="modal-add-mapping"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-mapping-panel" className="w-full max-w-[860px] relative">
          <div id="modal-add-mapping-tabs" className="flex gap-0">
            {[
              { id: "add-mapping", label: "Add New Mapping" },
              { id: "bulk-mapping", label: "Bulk Upload" },
            ].map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                onClick={() => setModalTab(t.id)}
                className={`px-4 py-2.5 text-[13px] font-semibold cursor-pointer border border-slate-300 -mb-px rounded-t ${
                  modalTab === t.id
                    ? "bg-white text-slate-800 border-b-white"
                    : "bg-slate-100 text-blue-600 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b rounded-tr shadow-xl border border-slate-300">
            {modalTab === "add-mapping" && (
              <>
                <div ref={formRef} className="p-5 flex flex-col gap-5 max-h-[68vh] overflow-auto">
                  {/*
                    The real product scopes this whole screen to the client selected in the header
                    switcher. This clone has no global client context, so Client is a field here instead.
                  */}
                  <div id="field-clm-client" className="flex flex-col gap-1 max-w-[320px]">
                    <label className="text-[13px] font-medium text-slate-700">
                      Client <span className="text-red-500">*</span>
                    </label>
                    <select id="clm-client" className={fieldCls()}>
                      <option value="">Select a Client</option>
                      {CLIENTS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-clm-loc-type" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Location Type <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-w-[240px]">
                        {["Warehouse", "Store", "USP", "WMS2"].map((t) => (
                          <label key={t} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input
                              type="radio"
                              name="clm-loc-type"
                              value={t}
                              defaultChecked={t === "Warehouse"}
                              className="accent-blue-600"
                            />
                            {t}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div id="field-clm-location" className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium text-slate-700">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <select id="clm-location" className={fieldCls()}>
                          <option value="">Select a Location</option>
                          {LOCATIONS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div id="field-clm-gstin" className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium text-slate-700">
                          GSTIN <span className="text-red-500">*</span>
                        </label>
                        <input id="clm-gstin" type="text" placeholder="GSTIN" className={fieldCls()} />
                      </div>
                    </div>
                  </div>

                  {/* Client Billing Address */}
                  <div id="clm-billing-section">
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-3">Client Billing Address</h4>
                    <div id="field-clm-billing-mode" className="flex flex-wrap gap-6 mb-4">
                      {[
                        { v: "form", label: "Use below form-filled" },
                        { v: "client", label: "Use Client Address" },
                        { v: "location", label: "Use Fulfillment Location Address" },
                      ].map((o) => (
                        <label key={o.v} className="flex items-center gap-2 text-[13px] cursor-pointer">
                          <input
                            type="radio"
                            name="clm-billing-mode"
                            value={o.v}
                            defaultChecked={o.v === "form"}
                            className="accent-blue-600"
                          />
                          {o.label}
                        </label>
                      ))}
                    </div>

                    <div id="clm-billing-fields" className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="clm-contact-name"
                          type="text"
                          placeholder="Contact Name *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <div id="clm-contact-more" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                          <input
                            id="clm-contact-email"
                            type="email"
                            placeholder="Contact Email"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                          <input
                            id="clm-contact-number"
                            type="tel"
                            placeholder="Contact Number"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="clm-address1"
                          type="text"
                          placeholder="Address Line 1 *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <div id="clm-address-more" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                          <input
                            id="clm-address2"
                            type="text"
                            placeholder="Address Line 2"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                          <input
                            id="clm-area"
                            type="text"
                            placeholder="Area"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="clm-city"
                          type="text"
                          placeholder="City *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <input
                          id="clm-pincode"
                          type="text"
                          placeholder="Pincode *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <div className="flex flex-col gap-1">
                          <label className="text-[13px] font-medium text-slate-700">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select id="clm-country" disabled={!billingEditable} className={fieldCls(billingEditable)}>
                            <option value="">Select Country</option>
                            <option value="IN">India</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <div className="flex flex-col gap-1">
                          <label className="text-[13px] font-medium text-slate-700">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select id="clm-state" disabled={!billingEditable} className={fieldCls(billingEditable)}>
                            <option value="">Select State</option>
                            <option value="KA">Karnataka</option>
                            <option value="MH">Maharashtra</option>
                            <option value="DL">Delhi</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="modal-add-mapping-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
                  <button
                    onClick={() => closeModal("modal-add-mapping")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="clm-btn-submit"
                    onClick={handleSubmit}
                    className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {modalTab === "bulk-mapping" && (
              <>
                <div ref={formRef} className="p-5 flex flex-col gap-4">
                  <h3 className="text-[15px] font-semibold text-slate-800">Upload Locations Mapping(s)</h3>

                  <div id="clm-bulk-file" className="flex items-stretch border-b border-slate-300">
                    <span className="flex-1 flex items-center text-[13px] text-slate-400 px-1">
                      {fileName || "Choose file..."}
                    </span>
                    <button
                      id="clm-btn-browse"
                      onClick={() => setFileName("client-location-mapping.csv")}
                      className="h-9 px-4 bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-t hover:bg-slate-300"
                    >
                      Browse
                    </button>
                  </div>

                  <div id="clm-bulk-limit" className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-600">(CSV Maximum row limit: 1000)</span>
                    <span className="flex items-center gap-1.5">
                      <button id="clm-download-template" className="text-[13px] text-blue-600 font-medium hover:underline">
                        Download Template
                      </button>
                      <button
                        id="clm-btn-fields"
                        onClick={() => setShowFields((v) => !v)}
                        title="Explain the CSV fields"
                        className="w-4 h-4 rounded-full border border-blue-600 text-blue-600 text-[10px] font-bold flex items-center justify-center"
                      >
                        i
                      </button>
                    </span>
                  </div>

                  <div id="clm-bulk-note" className="text-[13px] text-slate-600">
                    <strong>Note:</strong> billingAddressType field can accept the following values:
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      <li>
                        <strong>Client</strong> (Client Address will be used as Billing Address)
                      </li>
                      <li>
                        <strong>Location</strong> (Fulfillment Location Address will be used as Billing Address)
                      </li>
                      <li>
                        <strong>Empty value</strong> (Address given in CSV will be used as Billing Address)
                      </li>
                    </ul>
                  </div>

                  {/* Always mounted so a tour step can attach to it; visibility is toggled. */}
                  <div
                    id="clm-fields-panel"
                    className={`border border-slate-300 rounded shadow-lg bg-white${showFields ? "" : " hidden"}`}
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-300">
                      <h4 className="text-[13px] font-semibold text-slate-800">
                        Explanation of CSV Fields in the Template
                      </h4>
                      <button
                        onClick={() => setShowFields(false)}
                        className="text-[18px] text-slate-400 hover:text-slate-700 leading-none"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="px-4 py-1.5 text-right text-[12px] text-slate-500">
                      (Showing <strong>{CSV_FIELDS.length}</strong> Fields)
                    </div>
                    <div className="max-h-[240px] overflow-auto">
                      <table className="w-full border-collapse text-[12px]">
                        <thead>
                          <tr>
                            {["S No.", "Field", "Data Type", "Description", "Mandatory"].map((h) => (
                              <th
                                key={h}
                                className="bg-white text-left px-3 py-2 font-semibold border-b border-slate-300 sticky top-0"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {CSV_FIELDS.map(([field, type, desc, mandatory], i) => (
                            <tr key={field}>
                              <td className="px-3 py-1.5 border-b border-slate-100">{i + 1}</td>
                              <td className="px-3 py-1.5 border-b border-slate-100 font-medium">{field}</td>
                              <td className="px-3 py-1.5 border-b border-slate-100">{type}</td>
                              <td className="px-3 py-1.5 border-b border-slate-100">{desc}</td>
                              <td className="px-3 py-1.5 border-b border-slate-100">{mandatory}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div id="modal-bulk-mapping-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
                  <button
                    onClick={() => closeModal("modal-add-mapping")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="clm-btn-upload"
                    onClick={handleUpload}
                    className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
