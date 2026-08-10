"use client";

import { useEffect, useRef, useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { CustomersTour } from "@/features/oms/customers/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

interface CustomerRow {
  id: string;
  name: string;
  code: string;
  asnExpected: string;
  storageInspection: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
  priority: string;
}

const SEED_CUSTOMERS: CustomerRow[] = [
  {
    id: "1200156741",
    name: "AAA",
    code: "123456",
    asnExpected: "FALSE",
    storageInspection: "FALSE",
    contactName: "qwert",
    contactEmail: "",
    contactNumber: "",
    address: "Bellandur, BENGALURU - 567888, KARNATAKA, INDIA",
    priority: "3",
  },
];

/**
 * Columns the Download Template CSV expects — Supplier's 21 minus allowExcessGrn,
 * which is an inward-only concept that does not apply to customers.
 */
const CSV_FIELDS: [string, string, string, string][] = [
  ["name", "String", "NAME", "yes"],
  ["partnerCode", "String", "Partner Code", "yes"],
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
  ["priority", "Integer", "Priority (1 to 5)", "No"],
  ["isAsnExpected", "Boolean", "Is ASN Expected", "yes"],
  ["storageInspectionRequired", "Boolean", "Storage Inspection Required", "yes"],
  ["minStorageInspectPercent", "Integer", "Min. Storage Inspect %", "No"],
  ["minStorageInspectPassPercent", "Integer", "Min. Storage Inspect Pass %", "No"],
  ["crossDockInspectionRequired", "Boolean", "Cross Dock Inspection Required", "yes"],
  ["minCrossDockInspectPercent", "Integer", "Min. Cross Dock Inspect %", "No"],
  ["minCrossDockInspectPassPercent", "Integer", "Min. Cross Dock Inspect Pass %", "No"],
];

const SEARCH_BY_LABEL: Record<string, string> = {
  "customer-name": "Customer Name",
  "customer-code": "Customer Code",
  "customer-id": "Customer ID",
};

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function radioValue(name: string) {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value || "FALSE";
}

export default function OmsCustomersPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(CustomersTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Customers" }]} />
      <div className="product-page-body p-5">
        <OmsCustomersContent />
      </div>
    </>
  );
}

function OmsCustomersContent() {
  const [customers, setCustomers] = useState<CustomerRow[]>(SEED_CUSTOMERS);
  const [modalTab, setModalTab] = useState("add-customer");
  const [searchBy, setSearchBy] = useState("customer-name");
  const [fileName, setFileName] = useState("");
  const [showFields, setShowFields] = useState(false);
  // Percentage inputs only apply when their inspection flag is TRUE.
  const [storageInsp, setStorageInsp] = useState("FALSE");
  const [crossDockInsp, setCrossDockInsp] = useState("FALSE");
  const formRef = useRef<HTMLDivElement>(null);

  // Native listener so it also picks up values the tour sets programmatically.
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement | null;
      if (t?.name === "cust-storage-insp") setStorageInsp(t.value);
      if (t?.name === "cust-crossdock-insp") setCrossDockInsp(t.value);
    };
    el.addEventListener("change", onChange);
    return () => el.removeEventListener("change", onChange);
  }, [modalTab]);

  const handleSubmitCustomer = () => {
    const city = inputValue("cust-city");
    const pincode = inputValue("cust-pincode");
    const address = [inputValue("cust-address1"), inputValue("cust-area"), city, pincode && `- ${pincode}`]
      .filter(Boolean)
      .join(", ")
      .toUpperCase();

    const created: CustomerRow = {
      id: String(1200156742 + customers.length),
      name: inputValue("cust-name") || "RetailMart",
      code: inputValue("cust-code"),
      asnExpected: radioValue("cust-asn"),
      storageInspection: radioValue("cust-storage-insp"),
      contactName: inputValue("cust-contact-name"),
      contactEmail: inputValue("cust-contact-email"),
      contactNumber: inputValue("cust-contact-number"),
      address: address || "—",
      priority: (document.getElementById("cust-priority") as HTMLSelectElement | null)?.value || "3",
    };

    setCustomers((prev) => [created, ...prev]);
    closeModal("modal-add-customer");
    showToast("Customer created successfully");
  };

  const handleUpload = () => {
    closeModal("modal-add-customer");
    showToast("Bulk upload submitted — customers will appear once processed");
  };

  const pctClass = (enabled: boolean) =>
    `h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500 ${
      enabled ? "bg-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
    }`;

  return (
    <div className="max-w-6xl">
      {/* Search bar */}
      <div id="cust-search-bar" className="bg-slate-100 border border-slate-200 rounded p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 min-w-[170px]">
              <label className="text-[12px] font-semibold text-slate-700">Search By</label>
              <select
                id="cust-search-by"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="customer-code">Customer Code</option>
                <option value="customer-id">Customer ID</option>
                <option value="customer-name">Customer Name</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[220px]">
              <label className="text-[12px] font-semibold text-slate-700 sr-only">Search value</label>
              <input
                id="cust-search-value"
                type="text"
                placeholder={SEARCH_BY_LABEL[searchBy]}
                className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              id="cust-btn-search"
              className="h-8 px-4 rounded border border-blue-500 bg-white text-blue-600 text-[13px] font-semibold hover:bg-blue-50"
            >
              Search
            </button>
            <button
              id="cust-btn-add"
              onClick={() => {
                setModalTab("add-customer");
                document.getElementById("modal-add-customer")?.classList.add("open");
              }}
              className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
            >
              Add Customer
            </button>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Page Size</label>
              <select
                id="cust-page-size"
                defaultValue="100"
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
            <span id="cust-results-count" className="text-[13px] text-slate-500 pb-1.5">
              Showing <strong>{customers.length}</strong> results
            </span>
          </div>
        </div>

        <div className="mt-3">
          <input
            id="cust-find-results"
            type="text"
            placeholder="Find in results"
            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] min-w-[240px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Directory */}
      <div id="cust-results-table" className="bg-white border border-slate-200 rounded overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {[
                "Customer ID",
                "Name",
                "Customer Code",
                "Is ASN Expected",
                "Storage Inspection Required",
                "Contact Details",
                "Address",
                "Priority",
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
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-3 py-3 border-b border-slate-100 font-semibold text-blue-600">{c.id}</td>
                <td className="px-3 py-3 border-b border-slate-100 font-medium">{c.name}</td>
                <td className="px-3 py-3 border-b border-slate-100">{c.code || "—"}</td>
                <td className="px-3 py-3 border-b border-slate-100">{c.asnExpected}</td>
                <td className="px-3 py-3 border-b border-slate-100">{c.storageInspection}</td>
                <td className="px-3 py-3 border-b border-slate-100">
                  <div className="text-[12px] leading-relaxed">
                    <div>Name: {c.contactName || "—"}</div>
                    <div className="text-blue-600">Email: {c.contactEmail}</div>
                    <div>Mobile: {c.contactNumber}</div>
                  </div>
                </td>
                <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[260px]">
                  {c.address}
                  <div className="text-blue-600 mt-1 cursor-pointer hover:underline">View Locations</div>
                </td>
                <td className="px-3 py-3 border-b border-slate-100 font-semibold">{c.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Bulk Upload modal */}
      <div
        id="modal-add-customer"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-customer-panel" className="w-full max-w-[980px] relative">
          <div id="modal-add-customer-tabs" className="flex gap-0">
            {[
              { id: "add-customer", label: "Add New Customer" },
              { id: "bulk-customer", label: "Bulk Upload" },
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
            {modalTab === "add-customer" && (
              <>
                <div ref={formRef} className="p-5 flex flex-col gap-5">
                  {/* Identity */}
                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-cust-name" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cust-name"
                        type="text"
                        placeholder="Enter Customer Name"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="field-cust-code" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Customer Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cust-code"
                        type="text"
                        placeholder="Customer Code"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="field-cust-priority" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700 flex items-center gap-1.5">
                        Priority
                        <span
                          title="1 denotes most critical, 5 denotes least critical."
                          className="w-4 h-4 rounded-full border border-slate-400 text-slate-500 text-[10px] font-bold flex items-center justify-center"
                        >
                          i
                        </span>
                      </label>
                      <select
                        id="cust-priority"
                        defaultValue="3"
                        className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                      >
                        {["1", "2", "3", "4", "5"].map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Outward rules — laid out to match the product's own field grid */}
                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-cust-asn" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Is ASN Expected <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input type="radio" name="cust-asn" value={v} className="accent-blue-600" />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div id="field-cust-storage-insp" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Storage Inspection Required <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input
                              type="radio"
                              name="cust-storage-insp"
                              value={v}
                              defaultChecked={v === "FALSE"}
                              className="accent-blue-600"
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <input
                      id="cust-storage-min-pct"
                      type="text"
                      placeholder="Min. Storage Inspect %"
                      disabled={storageInsp !== "TRUE"}
                      className={pctClass(storageInsp === "TRUE")}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <input
                      id="cust-storage-pass-pct"
                      type="text"
                      placeholder="Min. Storage Inspect Pass %"
                      disabled={storageInsp !== "TRUE"}
                      className={pctClass(storageInsp === "TRUE")}
                    />
                    <div id="field-cust-crossdock-insp" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Cross Dock Inspection Required <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input
                              type="radio"
                              name="cust-crossdock-insp"
                              value={v}
                              defaultChecked={v === "FALSE"}
                              className="accent-blue-600"
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <input
                      id="cust-crossdock-min-pct"
                      type="text"
                      placeholder="Min. Cross Dock Inspect %"
                      disabled={crossDockInsp !== "TRUE"}
                      className={pctClass(crossDockInsp === "TRUE")}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <input
                      id="cust-crossdock-pass-pct"
                      type="text"
                      placeholder="Min. Cross Dock Inspect Pass %"
                      disabled={crossDockInsp !== "TRUE"}
                      className={pctClass(crossDockInsp === "TRUE")}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-2">Address Details</h4>
                    <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium text-slate-700">
                          Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="cust-contact-name"
                          type="text"
                          placeholder="Contact Name"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                      </div>
                      <div id="cust-contact-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                        <label className="text-[13px] font-medium text-slate-700">Contact Email / Number</label>
                        <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                          <input
                            id="cust-contact-email"
                            type="email"
                            placeholder="Contact Email"
                            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                          />
                          <input
                            id="cust-contact-number"
                            type="tel"
                            placeholder="Contact Number"
                            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cust-address1"
                        type="text"
                        placeholder="Address Line 1"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="cust-address-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                      <label className="text-[13px] font-medium text-slate-700">Address Line 2 / Area</label>
                      <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="cust-address2"
                          type="text"
                          placeholder="Address Line 2"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                        <input
                          id="cust-area"
                          type="text"
                          placeholder="Area"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cust-city"
                        type="text"
                        placeholder="City"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cust-pincode"
                        type="text"
                        placeholder="Pincode"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="cust-country"
                        className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                      >
                        <option value="">Select Country</option>
                        <option value="IN">India</option>
                        <option value="AE">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="cust-state"
                        className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="MH">Maharashtra</option>
                        <option value="KA">Karnataka</option>
                        <option value="DL">Delhi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  id="modal-add-customer-actions"
                  className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200"
                >
                  <button
                    onClick={() => closeModal("modal-add-customer")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="cust-btn-submit"
                    onClick={handleSubmitCustomer}
                    className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {modalTab === "bulk-customer" && (
              <>
                <div id="cust-bulk-panel" className="p-5 flex flex-col gap-4">
                  <h3 className="text-[15px] font-semibold text-slate-800">Upload Customer(s)</h3>

                  <div id="cust-bulk-file" className="flex items-stretch border-b border-slate-300">
                    <span className="flex-1 flex items-center text-[13px] text-slate-400 px-1">
                      {fileName || "Choose file..."}
                    </span>
                    <button
                      id="cust-btn-browse"
                      onClick={() => setFileName("customers.csv")}
                      className="h-9 px-4 bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-t hover:bg-slate-300"
                    >
                      Browse
                    </button>
                  </div>

                  <div id="cust-bulk-note" className="text-[13px] text-slate-600">
                    <strong>Note:</strong> Priority field in the CSV accepts numbers between 1 to 5. Priority 1 denotes
                    most critical and priority 5 denotes least critical.
                  </div>

                  <div id="cust-bulk-limit" className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-600">(CSV Maximum row limit: 3000)</span>
                    <span className="flex items-center gap-1.5">
                      <button id="cust-download-template" className="text-[13px] text-blue-600 font-medium hover:underline">
                        Download Template
                      </button>
                      <button
                        id="cust-btn-fields"
                        onClick={() => setShowFields((v) => !v)}
                        title="Explain the CSV fields"
                        className="w-4 h-4 rounded-full border border-blue-600 text-blue-600 text-[10px] font-bold flex items-center justify-center"
                      >
                        i
                      </button>
                    </span>
                  </div>

                  {/* Always mounted so a tour step can attach to it; visibility is toggled. */}
                  <div
                    id="cust-fields-panel"
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

                <div
                  id="modal-bulk-customer-actions"
                  className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200"
                >
                  <button
                    onClick={() => closeModal("modal-add-customer")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="cust-btn-upload"
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
