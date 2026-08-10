"use client";

import { useEffect, useRef, useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { SuppliersTour } from "@/features/oms/suppliers/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

interface SupplierRow {
  id: string;
  name: string;
  code: string;
  excessGrn: string;
  asnExpected: string;
  storageInspection: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
  priority: string;
}

const SEED_SUPPLIERS: SupplierRow[] = [
  {
    id: "1200156742",
    name: "ASP",
    code: "4567889",
    excessGrn: "FALSE",
    asnExpected: "FALSE",
    storageInspection: "FALSE",
    contactName: "ASjo",
    contactEmail: "",
    contactNumber: "",
    address: "Bellandur, BENGALURU - 656657, KARNATAKA, INDIA",
    priority: "3",
  },
];

/** Columns the Download Template CSV expects. */
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
  ["allowExcessGrn", "Boolean", "Allow Excess GRN", "yes"],
  ["isAsnExpected", "Boolean", "Is ASN Expected", "yes"],
  ["storageInspectionRequired", "Boolean", "Storage Inspection Required", "yes"],
  ["minStorageInspectPercent", "Integer", "Min. Storage Inspect %", "No"],
  ["minStorageInspectPassPercent", "Integer", "Min. Storage Inspect Pass %", "No"],
  ["crossDockInspectionRequired", "Boolean", "Cross Dock Inspection Required", "yes"],
  ["minCrossDockInspectPercent", "Integer", "Min. Cross Dock Inspect %", "No"],
  ["minCrossDockInspectPassPercent", "Integer", "Min. Cross Dock Inspect Pass %", "No"],
];

const SEARCH_BY_LABEL: Record<string, string> = {
  "supplier-name": "Supplier Name",
  "supplier-code": "Supplier Code",
  "supplier-id": "Supplier ID",
};

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function radioValue(name: string) {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value || "FALSE";
}

export default function OmsSuppliersPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(SuppliersTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Suppliers" }]} />
      <div className="product-page-body p-5">
        <OmsSuppliersContent />
      </div>
    </>
  );
}

function OmsSuppliersContent() {
  const [suppliers, setSuppliers] = useState<SupplierRow[]>(SEED_SUPPLIERS);
  const [modalTab, setModalTab] = useState("add-supplier");
  const [searchBy, setSearchBy] = useState("supplier-name");
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
      if (t?.name === "sup-storage-insp") setStorageInsp(t.value);
      if (t?.name === "sup-crossdock-insp") setCrossDockInsp(t.value);
    };
    el.addEventListener("change", onChange);
    return () => el.removeEventListener("change", onChange);
  }, [modalTab]);

  const handleSubmitSupplier = () => {
    const city = inputValue("sup-city");
    const pincode = inputValue("sup-pincode");
    const address = [inputValue("sup-address1"), inputValue("sup-area"), city, pincode && `- ${pincode}`]
      .filter(Boolean)
      .join(", ")
      .toUpperCase();

    const created: SupplierRow = {
      id: String(1200156743 + suppliers.length),
      name: inputValue("sup-name") || "XYZ Garments",
      code: inputValue("sup-code"),
      excessGrn: radioValue("sup-excess-grn"),
      asnExpected: radioValue("sup-asn"),
      storageInspection: radioValue("sup-storage-insp"),
      contactName: inputValue("sup-contact-name"),
      contactEmail: inputValue("sup-contact-email"),
      contactNumber: inputValue("sup-contact-number"),
      address: address || "—",
      priority: (document.getElementById("sup-priority") as HTMLSelectElement | null)?.value || "3",
    };

    setSuppliers((prev) => [created, ...prev]);
    closeModal("modal-add-supplier");
    showToast("Supplier created successfully");
  };

  const handleUpload = () => {
    closeModal("modal-add-supplier");
    showToast("Bulk upload submitted — suppliers will appear once processed");
  };

  const pctClass = (enabled: boolean) =>
    `h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500 ${
      enabled ? "bg-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
    }`;

  return (
    <div className="max-w-6xl">
      {/* Search bar */}
      <div id="sup-search-bar" className="bg-slate-100 border border-slate-200 rounded p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 min-w-[170px]">
              <label className="text-[12px] font-semibold text-slate-700">Search By</label>
              <select
                id="sup-search-by"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="supplier-code">Supplier Code</option>
                <option value="supplier-id">Supplier ID</option>
                <option value="supplier-name">Supplier Name</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[220px]">
              <label className="text-[12px] font-semibold text-slate-700 sr-only">Search value</label>
              <input
                id="sup-search-value"
                type="text"
                placeholder={SEARCH_BY_LABEL[searchBy]}
                className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              id="sup-btn-search"
              className="h-8 px-4 rounded border border-blue-500 bg-white text-blue-600 text-[13px] font-semibold hover:bg-blue-50"
            >
              Search
            </button>
            <button
              id="sup-btn-add"
              onClick={() => {
                setModalTab("add-supplier");
                document.getElementById("modal-add-supplier")?.classList.add("open");
              }}
              className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
            >
              Add Supplier
            </button>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Page Size</label>
              <select
                id="sup-page-size"
                defaultValue="100"
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
            <span id="sup-results-count" className="text-[13px] text-slate-500 pb-1.5">
              Showing <strong>{suppliers.length}</strong> results
            </span>
          </div>
        </div>

        <div className="mt-3">
          <input
            id="sup-find-results"
            type="text"
            placeholder="Find in results"
            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] min-w-[240px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Directory */}
      <div id="sup-results-table" className="bg-white border border-slate-200 rounded overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {[
                "Supplier ID",
                "Name",
                "Supplier Code",
                "Allow Excess GRN",
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
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td className="px-3 py-3 border-b border-slate-100 font-semibold text-blue-600">{s.id}</td>
                <td className="px-3 py-3 border-b border-slate-100 font-medium">{s.name}</td>
                <td className="px-3 py-3 border-b border-slate-100">{s.code || "—"}</td>
                <td className="px-3 py-3 border-b border-slate-100">{s.excessGrn}</td>
                <td className="px-3 py-3 border-b border-slate-100">{s.asnExpected}</td>
                <td className="px-3 py-3 border-b border-slate-100">{s.storageInspection}</td>
                <td className="px-3 py-3 border-b border-slate-100">
                  <div className="text-[12px] leading-relaxed">
                    <div>Name: {s.contactName || "—"}</div>
                    <div className="text-blue-600">Email: {s.contactEmail}</div>
                    <div>Mobile: {s.contactNumber}</div>
                  </div>
                </td>
                <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[260px]">
                  {s.address}
                  <div className="text-blue-600 mt-1 cursor-pointer hover:underline">View Locations</div>
                </td>
                <td className="px-3 py-3 border-b border-slate-100 font-semibold">{s.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Bulk Upload modal */}
      <div
        id="modal-add-supplier"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-supplier-panel" className="w-full max-w-[980px] relative">
          <div id="modal-add-supplier-tabs" className="flex gap-0">
            {[
              { id: "add-supplier", label: "Add New Supplier" },
              { id: "bulk-supplier", label: "Bulk Upload" },
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
            {modalTab === "add-supplier" && (
              <>
                <div ref={formRef} className="p-5 flex flex-col gap-5">
                  {/* Identity */}
                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-sup-name" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="sup-name"
                        type="text"
                        placeholder="Enter Supplier Name"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="field-sup-code" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Supplier Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="sup-code"
                        type="text"
                        placeholder="Supplier Code"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="field-sup-priority" className="flex flex-col gap-1">
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
                        id="sup-priority"
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

                  {/* Inward rules */}
                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-sup-excess-grn" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Allow Excess GRN <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input type="radio" name="sup-excess-grn" value={v} className="accent-blue-600" />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div id="field-sup-asn" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Is ASN Expected <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input type="radio" name="sup-asn" value={v} className="accent-blue-600" />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div id="field-sup-storage-insp" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Storage Inspection Required <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input
                              type="radio"
                              name="sup-storage-insp"
                              value={v}
                              defaultChecked={v === "FALSE"}
                              className="accent-blue-600"
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-sup-storage-pct" className="grid grid-cols-2 gap-5 col-span-2 max-[800px]:col-span-1">
                      <input
                        id="sup-storage-min-pct"
                        type="text"
                        placeholder="Min. Storage Inspect %"
                        disabled={storageInsp !== "TRUE"}
                        className={pctClass(storageInsp === "TRUE")}
                      />
                      <input
                        id="sup-storage-pass-pct"
                        type="text"
                        placeholder="Min. Storage Inspect Pass %"
                        disabled={storageInsp !== "TRUE"}
                        className={pctClass(storageInsp === "TRUE")}
                      />
                    </div>
                    <div id="field-sup-crossdock-insp" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Cross Dock Inspection Required <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-5 items-center h-8">
                        {["TRUE", "FALSE"].map((v) => (
                          <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input
                              type="radio"
                              name="sup-crossdock-insp"
                              value={v}
                              defaultChecked={v === "FALSE"}
                              className="accent-blue-600"
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div id="field-sup-crossdock-pct" className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                    <input
                      id="sup-crossdock-min-pct"
                      type="text"
                      placeholder="Min. Cross Dock Inspect %"
                      disabled={crossDockInsp !== "TRUE"}
                      className={pctClass(crossDockInsp === "TRUE")}
                    />
                    <input
                      id="sup-crossdock-pass-pct"
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
                          id="sup-contact-name"
                          type="text"
                          placeholder="Contact Name"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                      </div>
                      <div id="sup-contact-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                        <label className="text-[13px] font-medium text-slate-700">Contact Email / Number</label>
                        <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                          <input
                            id="sup-contact-email"
                            type="email"
                            placeholder="Contact Email"
                            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                          />
                          <input
                            id="sup-contact-number"
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
                        id="sup-address1"
                        type="text"
                        placeholder="Address Line 1"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="sup-address-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                      <label className="text-[13px] font-medium text-slate-700">Address Line 2 / Area</label>
                      <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="sup-address2"
                          type="text"
                          placeholder="Address Line 2"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                        <input
                          id="sup-area"
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
                        id="sup-city"
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
                        id="sup-pincode"
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
                        id="sup-country"
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
                        id="sup-state"
                        className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="KA">Karnataka</option>
                        <option value="TN">Tamil Nadu</option>
                        <option value="MH">Maharashtra</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  id="modal-add-supplier-actions"
                  className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200"
                >
                  <button
                    onClick={() => closeModal("modal-add-supplier")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="sup-btn-submit"
                    onClick={handleSubmitSupplier}
                    className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {modalTab === "bulk-supplier" && (
              <>
                <div id="sup-bulk-panel" className="p-5 flex flex-col gap-4">
                  <h3 className="text-[15px] font-semibold text-slate-800">Upload Supplier(s)</h3>

                  <div id="sup-bulk-file" className="flex items-stretch border-b border-slate-300">
                    <span className="flex-1 flex items-center text-[13px] text-slate-400 px-1">
                      {fileName || "Choose file..."}
                    </span>
                    <button
                      id="sup-btn-browse"
                      onClick={() => setFileName("suppliers.csv")}
                      className="h-9 px-4 bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-t hover:bg-slate-300"
                    >
                      Browse
                    </button>
                  </div>

                  <div id="sup-bulk-note" className="text-[13px] text-slate-600">
                    <strong>Note:</strong> Priority field in the CSV accepts numbers between 1 to 5. Priority 1 denotes
                    most critical and priority 5 denotes least critical.
                  </div>

                  <div id="sup-bulk-limit" className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-600">(CSV Maximum row limit: 3000)</span>
                    <span className="flex items-center gap-1.5">
                      <button id="sup-download-template" className="text-[13px] text-blue-600 font-medium hover:underline">
                        Download Template
                      </button>
                      <button
                        id="sup-btn-fields"
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
                    id="sup-fields-panel"
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
                  id="modal-bulk-supplier-actions"
                  className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200"
                >
                  <button
                    onClick={() => closeModal("modal-add-supplier")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="sup-btn-upload"
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
