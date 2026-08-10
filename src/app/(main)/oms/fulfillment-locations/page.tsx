"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { OmsTour } from "@/features/oms/fulfillment-locations/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

interface LocationRow {
  id: string;
  type: string;
  category: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
  timezone: string;
}

const SEED_LOCATIONS: LocationRow[] = [
  {
    id: "1200062467",
    type: "WAREHOUSE",
    category: "PRIMARY",
    name: "kisah",
    contactName: "Rajesh Kumar",
    contactEmail: "rajesh@kisah.in",
    contactNumber: "+91-9876543210",
    address: "Plot 42, Sector 12, Whitefield, BENGALURU - 560066, KARNATAKA, INDIA",
    timezone: "IST - Asia/Kolkata (+05:30)",
  },
  {
    id: "1200062508",
    type: "STORE",
    category: "PRIMARY",
    name: "confluxe-store",
    contactName: "Priya Sharma",
    contactEmail: "priya@confluxe.in",
    contactNumber: "+91-9988776655",
    address: "Shop 5, MG Road, Indiranagar, BENGALURU - 560038, KARNATAKA, INDIA",
    timezone: "IST - Asia/Kolkata (+05:30)",
  },
];

const TYPE_BADGE: Record<string, string> = {
  WAREHOUSE: "bg-blue-100 text-blue-700",
  STORE: "bg-emerald-100 text-emerald-700",
  USP: "bg-amber-100 text-amber-700",
  WMS2: "bg-indigo-100 text-indigo-700",
};

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() || "";
}

function selectValue(id: string) {
  return (document.getElementById(id) as HTMLSelectElement | null)?.value || "";
}

export default function OmsFulfillmentLocationsPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(OmsTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Fulfillment Locations" }]} />
      <div className="product-page-body p-5">
        <OmsFulfillmentLocationsContent />
      </div>
    </>
  );
}

function OmsFulfillmentLocationsContent() {
  const [locations, setLocations] = useState<LocationRow[]>(SEED_LOCATIONS);
  const [modalTab, setModalTab] = useState("add-location");
  const [fileName, setFileName] = useState("");

  const handleSubmitLocation = () => {
    const city = inputValue("oms-city");
    const pincode = inputValue("oms-pincode");
    const address = [inputValue("oms-address1"), inputValue("oms-area"), city, pincode && `- ${pincode}`]
      .filter(Boolean)
      .join(", ")
      .toUpperCase();

    const created: LocationRow = {
      id: String(1200062700 + locations.length),
      type:
        document.querySelector<HTMLInputElement>('input[name="oms-loc-type"]:checked')?.value.toUpperCase() ||
        "WAREHOUSE",
      category: "PRIMARY",
      name: inputValue("oms-location-name") || "Demo Central Warehouse",
      contactName: inputValue("oms-contact-name"),
      contactEmail: inputValue("oms-contact-email"),
      contactNumber: inputValue("oms-contact-number"),
      address: address || "—",
      timezone: selectValue("oms-location-tz") ? "IST - Asia/Kolkata (+05:30)" : "—",
    };

    setLocations((prev) => [created, ...prev]);
    closeModal("modal-add-location");
    showToast("Fulfillment location created successfully");
  };

  const handleUpload = () => {
    closeModal("modal-add-location");
    showToast("Bulk upload submitted — locations will appear once processed");
  };

  return (
    <div className="max-w-6xl">
      {/* Filter bar — filters, actions and search all on one row (matches product) */}
      <div id="oms-filter-bar" className="bg-slate-100 border border-slate-200 rounded p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[12px] font-semibold text-slate-700">Location Type</label>
              <select
                id="oms-location-type"
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="STORE">Store</option>
                <option value="USP">USP</option>
                <option value="WMS2">WMS2</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[12px] font-semibold text-slate-700">Category</label>
              <select
                id="oms-category"
                className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All</option>
                <option value="PRIMARY">Primary</option>
                <option value="SECONDARY">Secondary</option>
              </select>
            </div>
            <button
              id="oms-btn-refresh"
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              id="oms-btn-add"
              onClick={() => {
                setModalTab("add-location");
                document.getElementById("modal-add-location")?.classList.add("open");
              }}
              className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
            >
              Add New Location
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="oms-find-results"
              type="text"
              placeholder="Find in results"
              className="h-8 px-2.5 border border-slate-300 rounded text-[13px] min-w-[180px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <span id="oms-results-count" className="text-[13px] text-slate-500">
              Showing <strong>{locations.length}</strong> results
            </span>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div id="oms-results-table" className="bg-white border border-slate-200 rounded overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Location ID", "Location Type", "Category", "Name", "Contact Details", "Address", "Timezone"].map(
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
            {locations.map((l) => (
              <tr key={l.id}>
                <td className="px-3 py-3 border-b border-slate-100 font-semibold">{l.id}</td>
                <td className="px-3 py-3 border-b border-slate-100">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      TYPE_BADGE[l.type] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {l.type}
                  </span>
                </td>
                <td className="px-3 py-3 border-b border-slate-100">{l.category || "—"}</td>
                <td className="px-3 py-3 border-b border-slate-100 font-medium">{l.name}</td>
                <td className="px-3 py-3 border-b border-slate-100">
                  <div className="text-[12px] leading-relaxed">
                    <div>Name: {l.contactName || "—"}</div>
                    <div className="text-blue-600">Email: {l.contactEmail}</div>
                    <div>Mobile: {l.contactNumber}</div>
                  </div>
                </td>
                <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[280px]">
                  {l.address}
                </td>
                <td className="px-3 py-3 border-b border-slate-100 whitespace-nowrap">{l.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Bulk Upload modal */}
      <div
        id="modal-add-location"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-location-panel" className="w-full max-w-[920px] relative">
          {/* Modal tabs */}
          <div id="modal-add-location-tabs" className="flex gap-0">
            {[
              { id: "add-location", label: "Add New Fulfillment Location" },
              { id: "bulk-upload", label: "Bulk Upload" },
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
                <div className="p-5 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                    <div id="field-oms-name" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="oms-location-name"
                        type="text"
                        placeholder="Enter Fulfillment Location Name"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="oms-loc-type-wrap" className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Location Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-4 items-center h-8">
                        {["Warehouse", "Store", "USP", "WMS2"].map((t) => (
                          <label key={t} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                            <input type="radio" name="oms-loc-type" value={t} className="accent-blue-600" />
                            {t}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-2">Contact Details</h4>
                    <div className="grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium text-slate-700">
                          Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="oms-contact-name"
                          type="text"
                          placeholder="Contact Name"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                      </div>
                      <div id="oms-contact-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                        <label className="text-[13px] font-medium text-slate-700">Contact Email / Number</label>
                        <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                          <input
                            id="oms-contact-email"
                            type="email"
                            placeholder="Contact Email"
                            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                          />
                          <input
                            id="oms-contact-number"
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
                        id="oms-address1"
                        type="text"
                        placeholder="Address Line 1"
                        className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div id="oms-address-more" className="flex flex-col gap-1 col-span-2 max-[800px]:col-span-1">
                      <label className="text-[13px] font-medium text-slate-700">Address Line 2 / Area</label>
                      <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
                        <input
                          id="oms-address2"
                          type="text"
                          placeholder="Address Line 2"
                          className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500"
                        />
                        <input
                          id="oms-area"
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
                        id="oms-city"
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
                        id="oms-pincode"
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
                        id="oms-country"
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
                        id="oms-state"
                        className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="KA">Karnataka</option>
                        <option value="MH">Maharashtra</option>
                        <option value="DL">Delhi</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-slate-700">
                        Timezone <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="oms-location-tz"
                        className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500"
                      >
                        <option value="">Select Timezone</option>
                        <option value="IST">IST - Asia/Kolkata (+05:30)</option>
                        <option value="GST">GST - Asia/Dubai (+04:00)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  id="modal-add-location-actions"
                  className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200"
                >
                  <button
                    onClick={() => closeModal("modal-add-location")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="oms-btn-submit"
                    onClick={handleSubmitLocation}
                    className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {modalTab === "bulk-upload" && (
              <>
                <div id="oms-bulk-panel" className="p-5 flex flex-col gap-4">
                  <h3 className="text-[15px] font-semibold text-slate-800">Upload Fulfillment Location(s)</h3>

                  <div id="oms-bulk-file" className="flex items-stretch border-b border-slate-300">
                    <span className="flex-1 flex items-center text-[13px] text-slate-400 px-1">
                      {fileName || "Choose file..."}
                    </span>
                    <button
                      id="oms-btn-browse"
                      onClick={() => setFileName("fulfillment-locations.csv")}
                      className="h-9 px-4 bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-t hover:bg-slate-300"
                    >
                      Browse
                    </button>
                  </div>

                  <div id="oms-bulk-limit" className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-600">(CSV Maximum row limit: 1000)</span>
                    <span className="flex items-center gap-1.5">
                      <button id="oms-download-template" className="text-[13px] text-blue-600 font-medium hover:underline">
                        Download Template
                      </button>
                      <span
                        title="The template lists every column the CSV must contain."
                        className="w-4 h-4 rounded-full border border-blue-600 text-blue-600 text-[10px] font-bold flex items-center justify-center"
                      >
                        i
                      </span>
                    </span>
                  </div>

                  <div id="oms-bulk-note" className="text-[13px] text-slate-600">
                    <div className="font-semibold text-slate-700 mb-1">Note:</div>
                    <ul className="list-disc pl-5 flex flex-col gap-1">
                      <li>
                        The <strong>type</strong> field in CSV only accepts <strong>STORE, USP, WAREHOUSE</strong> or{" "}
                        <strong>WMS2</strong> as input
                      </li>
                      <li>
                        <strong>timeZone</strong> field only accepts Zone ID eg. Asia/Kolkata.{" "}
                        <span className="text-blue-600">Click here</span> to view all valid Timezones
                      </li>
                    </ul>
                  </div>
                </div>

                <div id="modal-bulk-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
                  <button
                    onClick={() => closeModal("modal-add-location")}
                    className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="oms-btn-upload"
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
