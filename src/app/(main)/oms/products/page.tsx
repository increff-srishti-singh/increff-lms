"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { ProductsTour } from "@/features/oms/products/tour-config";
import { showToast } from "@/shared/lib/tour-utils";

type CsvField = [field: string, type: string, description: string, mandatory: string];

/**
 * The New tab's first 8 fields are confirmed from the product screenshot ("Showing 30
 * Fields"). Fields 9-30 are not shown there — extrapolated from the notes' product field
 * table (category, size, color, MRP, tax, image, dimensions, perishable flag) plus 10
 * custom attribute columns, chosen to land on exactly 30 total.
 */
const NEW_SKU_FIELDS: CsvField[] = [
  ["clientSkuId", "String", "Client-Specific Unique Identifier for an SKU", "yes"],
  ["isBundled", "Boolean", "Flag to specify whether the SKU should be marked as Bundled Combo SKU", "No"],
  ["isSerialCodeRequired", "Boolean", "Flag to specify whether the SKU can have a serial code or not", "No"],
  ["isUom", "Boolean", "Whether SKU is a Unit of Measure (UOM) SKU or not", "No"],
  ["barcode", "String", "Scannable code present on physical product that identifies an SKU uniquely", "yes"],
  ["brandId", "String", "The brand associated with the product", "yes"],
  ["name", "String", "Name of the product", "yes"],
  ["styleId", "String", "The style identifier for the product", "yes"],
  ["category", "String", "Product category", "yes"],
  ["size", "String", "Size variant of the product", "No"],
  ["color", "String", "Color variant of the product", "No"],
  ["mrp", "Decimal", "Maximum Retail Price of the product", "yes"],
  ["sellingPrice", "Decimal", "Selling price of the product, if different from MRP", "No"],
  ["taxPercent", "Decimal", "Applicable tax percentage used for invoicing", "yes"],
  ["imageUrl", "String", "URL of the product image, used for GRN / QC / picking verification", "No"],
  ["isPerishable", "Boolean", "Whether the SKU has expiry or shelf life", "No"],
  ["length", "Decimal", "Length of the SKU in cm", "No"],
  ["breadth", "Decimal", "Breadth of the SKU in cm", "No"],
  ["height", "Decimal", "Height of the SKU in cm", "No"],
  ["weight", "Decimal", "Weight of the SKU in grams", "No"],
  ["attribute1", "String", "Custom attribute 1 (e.g. Fabric)", "No"],
  ["attribute2", "String", "Custom attribute 2 (e.g. Season)", "No"],
  ["attribute3", "String", "Custom attribute 3", "No"],
  ["attribute4", "String", "Custom attribute 4", "No"],
  ["attribute5", "String", "Custom attribute 5", "No"],
  ["attribute6", "String", "Custom attribute 6", "No"],
  ["attribute7", "String", "Custom attribute 7", "No"],
  ["attribute8", "String", "Custom attribute 8", "No"],
  ["attribute9", "String", "Custom attribute 9", "No"],
  ["attribute10", "String", "Custom attribute 10", "No"],
];

/**
 * No screenshot exists for the Edit tab. Modelled as the same 30 columns as New, since
 * an edit CSV updating existing SKUs plausibly touches the same fields — but only
 * clientSkuId is mandatory here; every other column is an optional override.
 */
const EDIT_SKU_FIELDS: CsvField[] = NEW_SKU_FIELDS.map(([field, type, desc]) => [
  field,
  type,
  desc,
  field === "clientSkuId" ? "yes" : "No",
]);

const PERISHABLE_FIELDS: CsvField[] = [
  ["clientSkuId", "String", "Client-Specific Unique Identifier for an SKU", "yes"],
];

const BUNDLED_SKU_FIELDS: CsvField[] = [
  ["bundledParentClientSkuId", "String", "Unique Identifier of a bundled parent SKU in a bundled SKU definition", "yes"],
  ["childClientSkuId", "String", "Unique Identifier of a child SKU in a bundled SKU or UOM (Unit of Measure) definition", "yes"],
  ["qty", "Integer", "Quantity of child SKU", "yes"],
];

const UOM_FIELDS: CsvField[] = [
  ["clientSkuId (uomClientSkuId)", "String", "Unique Identifier for a Unit of Measure (UOM) SKU associated with a specific client", "yes"],
  ["nextBreakableSkuId (childClientSkuId)", "String", "Unique Identifier for the next breakable SKU that a Unit of Measure (UOM) SKU can be broken into", "yes"],
  ["nextBreakableSkuQty (childUomQty)", "Integer", "Quantity of the next breakable SKU that a Unit of Measure (UOM) SKU can be broken into", "yes"],
];

interface CsvTabConfig {
  id: string;
  label: string;
  heading: string;
  note?: string[];
  rowLimit: number;
  fields: CsvField[];
  submitLabel: string;
  toastMessage: string;
}

const TABS: CsvTabConfig[] = [
  {
    id: "new",
    label: "New",
    heading: "CSV File",
    note: [
      "Fields with empty values in the CSV file are left unchanged on the existing SKU.",
      "Fields with null values in the CSV file will clear the existing value.",
    ],
    rowLimit: 15000,
    fields: NEW_SKU_FIELDS,
    submitLabel: "Submit",
    toastMessage: "Product master uploaded — SKUs will appear once processed",
  },
  {
    id: "edit",
    label: "Edit",
    heading: "CSV File",
    note: [
      "clientSkuId is required to identify which SKU to update.",
      "Every other column is optional — leave it blank to keep the SKU's current value.",
    ],
    rowLimit: 15000,
    fields: EDIT_SKU_FIELDS,
    submitLabel: "Submit",
    toastMessage: "Product updates uploaded — changes will appear once processed",
  },
  {
    id: "perishable",
    label: "Mark SKUs as Perishable",
    heading: "CSV File",
    note: ["This feature is available only for the clients having Expiry feature."],
    rowLimit: 15000,
    fields: PERISHABLE_FIELDS,
    submitLabel: "Submit",
    toastMessage: "SKUs marked as perishable — batch/expiry tracking will apply once processed",
  },
  {
    id: "bundled",
    label: "Bundled SKU Definition",
    heading: "CSV Upload",
    rowLimit: 5000,
    fields: BUNDLED_SKU_FIELDS,
    submitLabel: "Submit",
    toastMessage: "Bundled SKU definitions uploaded successfully",
  },
  {
    id: "uom",
    label: "UOM Definition",
    heading: "CSV Upload",
    rowLimit: 5000,
    fields: UOM_FIELDS,
    submitLabel: "Submit",
    toastMessage: "UOM definitions uploaded successfully",
  },
];

export default function OmsProductsPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(ProductsTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <div className="product-page-body p-5">
        <OmsProductsContent />
      </div>
    </>
  );
}

function OmsProductsContent() {
  const [tab, setTab] = useState("new");
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [openFields, setOpenFields] = useState<Record<string, boolean>>({});

  const handleBrowse = (tabId: string) => {
    setFileNames((prev) => ({ ...prev, [tabId]: `${tabId}.csv` }));
  };

  const handleSubmit = (tabConfig: CsvTabConfig) => {
    showToast(tabConfig.toastMessage);
  };

  return (
    <div className="max-w-6xl">
      {/* Tabs */}
      <div id="prod-tabs" className="flex gap-0 mb-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 bg-transparent border-none border-b-2 text-xs font-semibold -mb-px cursor-pointer whitespace-nowrap ${
              tab === t.id
                ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t"
                : "text-blue-500 border-b-transparent hover:text-blue-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-b rounded-tr p-6 min-h-[220px]">
        {TABS.map((t) => {
          if (t.id !== tab) return null;
          const fileName = fileNames[t.id] || "";
          const fieldsOpen = !!openFields[t.id];

          return (
            <div key={t.id} id={`prod-${t.id}-panel`} className="flex flex-col gap-4 max-w-[720px]">
              <h3 className="text-[15px] font-semibold text-slate-800">{t.heading}</h3>

              <div id={`prod-${t.id}-file`} className="flex items-center gap-3 flex-wrap">
                <div className="flex items-stretch border-b border-slate-300 min-w-[280px]">
                  <span className="flex-1 flex items-center text-[13px] text-slate-400 px-1">
                    {fileName || "Choose file..."}
                  </span>
                  <button
                    id={`prod-${t.id}-browse`}
                    onClick={() => handleBrowse(t.id)}
                    className="h-9 px-4 bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-t hover:bg-slate-300"
                  >
                    Browse
                  </button>
                </div>
                <span id={`prod-${t.id}-limit`} className="flex items-center gap-1.5 text-[13px]">
                  <a className="text-blue-600 font-medium hover:underline cursor-pointer">Download Template</a>
                  <button
                    id={`prod-${t.id}-btn-fields`}
                    onClick={() => setOpenFields((prev) => ({ ...prev, [t.id]: !prev[t.id] }))}
                    title="Explain the CSV fields"
                    className="w-4 h-4 rounded-full border border-blue-600 text-blue-600 text-[10px] font-bold flex items-center justify-center"
                  >
                    i
                  </button>
                  <span className="text-slate-600">(Maximum row limit: {t.rowLimit.toLocaleString()})</span>
                </span>
              </div>

              {t.note && (
                <div id={`prod-${t.id}-note`} className="text-[13px] text-slate-600">
                  <strong>Note:</strong>
                  <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                    {t.note.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                id={`prod-${t.id}-submit`}
                onClick={() => handleSubmit(t)}
                className="self-start h-8 px-5 rounded border border-blue-500 bg-white text-blue-600 text-[13px] font-semibold hover:bg-blue-50"
              >
                {t.submitLabel}
              </button>

              {/* Always mounted so a tour step can attach to it; visibility is toggled. */}
              <div
                id={`prod-${t.id}-fields-panel`}
                className={`border border-slate-300 rounded shadow-lg bg-white mt-2${fieldsOpen ? "" : " hidden"}`}
              >
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-300">
                  <h4 className="text-[13px] font-semibold text-slate-800">
                    Explanation of CSV Fields in the Template
                  </h4>
                  <button
                    onClick={() => setOpenFields((prev) => ({ ...prev, [t.id]: false }))}
                    className="text-[18px] text-slate-400 hover:text-slate-700 leading-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="px-4 py-1.5 text-right text-[12px] text-slate-500">
                  (Showing <strong>{t.fields.length}</strong> Fields)
                </div>
                <div className="max-h-[280px] overflow-auto">
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
                      {t.fields.map(([field, type, desc, mandatory], i) => (
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
          );
        })}
      </div>
    </div>
  );
}
