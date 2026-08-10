"use client";

import { useEffect, useRef, useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PartnerLocationsTour } from "@/features/oms/partner-locations/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

interface PartnerLocationRow {
  id: string;
  code: string;
  name: string;
  gstin: string;
  shipContact: string;
  shipAddress: string;
  billContact: string;
  billAddress: string;
}

/** Columns the Download Template CSV expects — gstin plus a shipping and a billing block. */
const CSV_FIELDS: [string, string, string, string][] = [
  ["gstin", "String", "Goods and Services Tax Identification Number", "yes"],
  ["shippingContactName", "String", "Shipping Contact Name", "yes"],
  ["shippingContactEmail", "String", "Shipping Contact Email", "No"],
  ["shippingContactPhone", "String", "Shipping Contact Phone", "No"],
  ["shippingStreet1", "String", "Shipping Address Line 1", "yes"],
  ["shippingStreet2", "String", "Shipping Address Line 2", "No"],
  ["shippingStreet3", "String", "Shipping Address Line 3", "No"],
  ["shippingCity", "String", "Shipping City", "yes"],
  ["shippingPincode", "String", "Shipping Pincode", "yes"],
  ["shippingCountry", "String", "Shipping Country", "yes"],
  ["shippingState", "String", "Shipping State", "yes"],
  ["billingContactName", "String", "Billing Contact Name", "yes"],
  ["billingContactEmail", "String", "Billing Contact Email", "No"],
  ["billingContactPhone", "String", "Billing Contact Phone", "No"],
  ["billingStreet1", "String", "Billing Address Line 1", "yes"],
  ["billingStreet2", "String", "Billing Address Line 2", "No"],
  ["billingStreet3", "String", "Billing Address Line 3", "No"],
  ["billingCity", "String", "Billing City", "yes"],
  ["billingPincode", "String", "Billing Pincode", "yes"],
  ["billingCountry", "String", "Billing Country", "yes"],
  ["billingState", "String", "Billing State", "yes"],
];

const PARTNERS: Record<string, { value: string; label: string }[]> = {
  Supplier: [
    { value: "xyz-garments", label: "XYZ Garments" },
    { value: "tirupur-textiles", label: "Tirupur Textiles" },
  ],
  Customer: [
    { value: "retailmart", label: "RetailMart" },
    { value: "citymart", label: "CityMart" },
  ],
};

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function selectText(id: string) {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  if (!el || !el.value) return "";
  return el.options[el.selectedIndex]?.text || "";
}

export default function OmsPartnerLocationsPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(PartnerLocationsTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Partner Locations" }]} />
      <div className="product-page-body p-5">
        <OmsPartnerLocationsContent />
      </div>
    </>
  );
}

function OmsPartnerLocationsContent() {
  const [searchTab, setSearchTab] = useState("search-partner");
  const [partnerType, setPartnerType] = useState("Supplier");
  const [rows, setRows] = useState<PartnerLocationRow[]>([]);
  const [modalTab, setModalTab] = useState("add-location");
  const [fileName, setFileName] = useState("");
  const [showFields, setShowFields] = useState(false);
  // Conditional form state — all driven by native change events so the tour can set them too.
  const [gstinNa, setGstinNa] = useState(false);
  const [billingMode, setBillingMode] = useState("form");
  const [multiSupplier, setMultiSupplier] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement | null;
      if (!t) return;
      if (t.id === "pl-gstin-na") setGstinNa(t.checked);
      if (t.name === "pl-billing-mode") setBillingMode(t.value);
      if (t.id === "pl-multi-supplier") setMultiSupplier(t.checked);
    };
    el.addEventListener("change", onChange);
    return () => el.removeEventListener("change", onChange);
  }, [modalTab]);

  const billingEditable = billingMode === "form";

  const handleSubmit = () => {
    const shipAddress = [
      inputValue("pl-ship-address1"),
      inputValue("pl-ship-area"),
      inputValue("pl-ship-city"),
      inputValue("pl-ship-pincode") && `- ${inputValue("pl-ship-pincode")}`,
      selectText("pl-ship-state"),
    ]
      .filter(Boolean)
      .join(", ")
      .toUpperCase();

    const billAddress = billingEditable
      ? [inputValue("pl-bill-address1"), inputValue("pl-bill-city")].filter(Boolean).join(", ").toUpperCase()
      : billingMode === "shipping"
        ? shipAddress
        : "Same as supplier address";

    const created: PartnerLocationRow = {
      id: String(1200078400 + rows.length),
      code: (selectText("pl-supplier") || "PARTNER").toUpperCase().replace(/\s+/g, "-"),
      name: `${selectText("pl-supplier") || "Partner"} — ${inputValue("pl-ship-city") || "Location"}`,
      gstin: gstinNa ? "NA" : inputValue("pl-gstin") || "—",
      shipContact: inputValue("pl-ship-contact-name") || "—",
      shipAddress: shipAddress || "—",
      billContact: billingEditable ? inputValue("pl-bill-contact-name") || "—" : inputValue("pl-ship-contact-name") || "—",
      billAddress: billAddress || "—",
    };

    setRows((prev) => [created, ...prev]);
    closeModal("modal-add-partner-location");
    showToast("Partner location created successfully");
  };

  const handleUpload = () => {
    closeModal("modal-add-partner-location");
    showToast("Bulk upload submitted — locations will appear once processed");
  };

  const fieldCls = (enabled = true) =>
    `h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500 ${
      enabled ? "bg-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
    }`;

  return (
    <div className="max-w-6xl">
      {/* Search tabs */}
      <div id="pl-search-tabs" className="flex gap-0 mb-0">
        {[
          { id: "search-partner", label: "Search by Partner" },
          { id: "search-location", label: "Search by Location ID" },
        ].map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => setSearchTab(t.id)}
            className={`px-4 py-2.5 bg-transparent border-none border-b-2 text-xs font-semibold -mb-px cursor-pointer ${
              searchTab === t.id
                ? "text-slate-800 border-b-slate-800 bg-white border border-slate-300 rounded-t"
                : "text-blue-600 border-b-transparent hover:text-blue-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="pl-search-bar" className="bg-slate-100 border border-slate-200 rounded-b rounded-tr p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            {searchTab === "search-partner" ? (
              <>
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <label className="text-[12px] font-semibold text-slate-700">Partner Type</label>
                  <select
                    id="pl-partner-type"
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select Partner Type</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 min-w-[240px]">
                  <label className="text-[12px] font-semibold text-slate-700">{partnerType || "Partner"}</label>
                  <select
                    id="pl-partner"
                    className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a {(partnerType || "PARTNER").toUpperCase()}</option>
                    {(PARTNERS[partnerType] || []).map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1 min-w-[240px]">
                <label className="text-[12px] font-semibold text-slate-700">Location ID</label>
                <input
                  id="pl-location-id"
                  type="text"
                  placeholder="Enter Location ID"
                  className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}

            <button
              id="pl-btn-search"
              className="h-8 px-4 rounded border border-blue-500 bg-white text-blue-600 text-[13px] font-semibold hover:bg-blue-50"
            >
              Search
            </button>
            <button
              id="pl-btn-add"
              onClick={() => {
                setModalTab("add-location");
                document.getElementById("modal-add-partner-location")?.classList.add("open");
              }}
              className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
            >
              Add Location
            </button>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Page Size</label>
              <select
                id="pl-page-size"
                defaultValue="100"
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
            <span id="pl-results-count" className="text-[13px] text-slate-500 pb-1.5">
              Showing <strong>{rows.length}</strong> results
            </span>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div id="pl-results-table" className="bg-white border border-slate-200 rounded overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {[
                "Location ID",
                "Fulfillment Location Code",
                "Fulfillment Location Name",
                "GSTIN No.",
                "Shipping Contact Details",
                "Shipping Address",
                "Billing Contact Details",
                "Billing Address",
              ].map((h) => (
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-slate-500">
                  No Data to Show
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-3 border-b border-slate-100 font-semibold text-blue-600">{r.id}</td>
                  <td className="px-3 py-3 border-b border-slate-100">{r.code}</td>
                  <td className="px-3 py-3 border-b border-slate-100 font-medium">{r.name}</td>
                  <td className="px-3 py-3 border-b border-slate-100">{r.gstin}</td>
                  <td className="px-3 py-3 border-b border-slate-100 text-[12px]">{r.shipContact}</td>
                  <td className="px-3 py-3 border-b border-slate-100 text-[12px] max-w-[220px]">{r.shipAddress}</td>
                  <td className="px-3 py-3 border-b border-slate-100 text-[12px]">{r.billContact}</td>
                  <td className="px-3 py-3 border-b border-slate-100 text-[12px] max-w-[220px]">{r.billAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Bulk Upload modal */}
      <div
        id="modal-add-partner-location"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-pl-panel" className="w-full max-w-[860px] relative">
          <div id="modal-add-pl-tabs" className="flex gap-0">
            {[
              { id: "add-location", label: "Add New Location" },
              { id: "bulk-location", label: "Bulk Upload" },
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
            {modalTab === "add-location" && (
              <>
                <div ref={formRef} className="p-5 flex flex-col gap-5 max-h-[68vh] overflow-auto">
                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-pl-supplier" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Supplier <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="pl-supplier"
                        className="h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500"
                      >
                        <option value="">Select a SUPPLIER</option>
                        {PARTNERS.Supplier.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div id="field-pl-gstin" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        GSTIN No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pl-gstin"
                        type="text"
                        placeholder="Enter GSTIN No."
                        disabled={gstinNa}
                        className={fieldCls(!gstinNa)}
                      />
                    </div>
                    <div id="field-pl-gstin-na" className="flex items-end pb-1.5">
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input id="pl-gstin-na" type="checkbox" className="accent-blue-600" />
                        NA
                      </label>
                    </div>
                  </div>

                  <div id="field-pl-expose">
                    <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                      <input id="pl-expose-inventory" type="checkbox" className="accent-blue-600" />
                      Expose Location Inventory on Channels
                    </label>
                  </div>

                  {/* Shipping Address */}
                  <div id="pl-shipping-section">
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-3">Shipping Address</h4>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input id="pl-ship-contact-name" type="text" placeholder="Contact Name *" className={fieldCls()} />
                        <div id="pl-ship-contact-more" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                          <input id="pl-ship-email" type="email" placeholder="Contact Email" className={fieldCls()} />
                          <input id="pl-ship-phone" type="tel" placeholder="Contact Number" className={fieldCls()} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input id="pl-ship-address1" type="text" placeholder="Address Line 1 *" className={fieldCls()} />
                        <div id="pl-ship-address-more" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                          <input id="pl-ship-address2" type="text" placeholder="Address Line 2" className={fieldCls()} />
                          <input id="pl-ship-area" type="text" placeholder="Area" className={fieldCls()} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input id="pl-ship-city" type="text" placeholder="City *" className={fieldCls()} />
                        <input id="pl-ship-pincode" type="text" placeholder="Pincode *" className={fieldCls()} />
                        <div className="flex flex-col gap-1">
                          <label className="text-[13px] font-medium text-slate-700">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select id="pl-ship-country" className={fieldCls()}>
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
                          <select id="pl-ship-state" className={fieldCls()}>
                            <option value="">Select State</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="KA">Karnataka</option>
                            <option value="MH">Maharashtra</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div id="pl-billing-section">
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-3">Billing Address</h4>
                    <div id="field-pl-billing-mode" className="flex flex-wrap gap-6 mb-4">
                      {[
                        { v: "form", label: "Use below form-filled" },
                        { v: "shipping", label: "Use Shipping Address" },
                        { v: "supplier", label: "Use Supplier Address" },
                      ].map((o) => (
                        <label key={o.v} className="flex items-center gap-2 text-[13px] cursor-pointer">
                          <input
                            type="radio"
                            name="pl-billing-mode"
                            value={o.v}
                            defaultChecked={o.v === "form"}
                            className="accent-blue-600"
                          />
                          {o.label}
                        </label>
                      ))}
                    </div>

                    <div id="pl-billing-fields" className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="pl-bill-contact-name"
                          type="text"
                          placeholder="Contact Name *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <div id="pl-bill-contact-more" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                          <input
                            id="pl-bill-email"
                            type="email"
                            placeholder="Contact Email"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                          <input
                            id="pl-bill-phone"
                            type="tel"
                            placeholder="Contact Number"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="pl-bill-address1"
                          type="text"
                          placeholder="Address Line 1 *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <div id="pl-bill-address-more" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                          <input
                            id="pl-bill-address2"
                            type="text"
                            placeholder="Address Line 2"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                          <input
                            id="pl-bill-area"
                            type="text"
                            placeholder="Area"
                            disabled={!billingEditable}
                            className={fieldCls(billingEditable)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="pl-bill-city"
                          type="text"
                          placeholder="City *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <input
                          id="pl-bill-pincode"
                          type="text"
                          placeholder="Pincode *"
                          disabled={!billingEditable}
                          className={fieldCls(billingEditable)}
                        />
                        <div className="flex flex-col gap-1">
                          <label className="text-[13px] font-medium text-slate-700">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select id="pl-bill-country" disabled={!billingEditable} className={fieldCls(billingEditable)}>
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
                          <select id="pl-bill-state" disabled={!billingEditable} className={fieldCls(billingEditable)}>
                            <option value="">Select State</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="KA">Karnataka</option>
                            <option value="MH">Maharashtra</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="modal-add-pl-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
                  <button
                    onClick={() => closeModal("modal-add-partner-location")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="pl-btn-submit"
                    onClick={handleSubmit}
                    className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {modalTab === "bulk-location" && (
              <>
                <div ref={formRef} className="p-5 flex flex-col gap-4">
                  <div id="field-pl-bulk-supplier" className="flex flex-wrap items-end gap-6">
                    <div className="flex flex-col gap-1 min-w-[220px]">
                      <label className="text-[13px] font-medium text-slate-700">
                        Select Supplier <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="pl-bulk-supplier"
                        disabled={multiSupplier}
                        className={fieldCls(!multiSupplier)}
                      >
                        <option value="">Select a SUPPLIER</option>
                        {PARTNERS.Supplier.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[13px] text-slate-500 pb-1.5">OR</span>
                    <label className="flex items-center gap-2 text-[13px] cursor-pointer pb-1.5">
                      <input id="pl-multi-supplier" type="checkbox" className="accent-blue-600" />
                      Upload Locations for multiple Suppliers in CSV
                    </label>
                  </div>

                  <div id="pl-bulk-panel" className="flex flex-col gap-4">
                    <h3 className="text-[15px] font-semibold text-slate-800">Upload Supplier Location(s)</h3>

                    <div id="pl-bulk-file" className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-stretch border-b border-slate-300 min-w-[280px]">
                        <span className="flex-1 flex items-center text-[13px] text-slate-400 px-1">
                          {fileName || "Choose file..."}
                        </span>
                        <button
                          id="pl-btn-browse"
                          onClick={() => setFileName("partner-locations.csv")}
                          className="h-9 px-4 bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-t hover:bg-slate-300"
                        >
                          Browse
                        </button>
                      </div>
                      <span id="pl-bulk-limit" className="flex items-center gap-1.5">
                        <button id="pl-download-template" className="text-[13px] text-blue-600 font-medium hover:underline">
                          Download Template
                        </button>
                        <button
                          id="pl-btn-fields"
                          onClick={() => setShowFields((v) => !v)}
                          title="Explain the CSV fields"
                          className="w-4 h-4 rounded-full border border-blue-600 text-blue-600 text-[10px] font-bold flex items-center justify-center"
                        >
                          i
                        </button>
                        <span className="text-[13px] text-slate-600 ml-1">(CSV Maximum row limit: 3000)</span>
                      </span>
                    </div>

                    {/* Always mounted so a tour step can attach to it; visibility is toggled. */}
                    <div
                      id="pl-fields-panel"
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
                </div>

                <div id="modal-bulk-pl-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
                  <button
                    onClick={() => closeModal("modal-add-partner-location")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="pl-btn-upload"
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
