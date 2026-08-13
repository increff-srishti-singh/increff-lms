"use client";

import { useRef, useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { CaptureSkuDimensionsTour } from "@/features/oms/capture-sku-dimensions/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

const CLIENTS = [
  { value: "test11", label: "Test11" },
  { value: "abc-fashion", label: "ABC Fashion" },
];

interface SkuRecord {
  description: string;
  brand: string;
  category: string;
  style: string;
  color: string;
  mrp: string;
}

/** Matches the screenshot exactly — one demo SKU with no dimensions captured yet. */
const SKU_MASTER: Record<string, SkuRecord> = {
  SHIRT001: {
    description: "Men Cotton Shirt Blue M",
    brand: "BRAND001",
    category: "-",
    style: "STYLE001",
    color: "-",
    mrp: "999",
  },
};

interface DimensionValues {
  length: string;
  breadth: string;
  height: string;
  weight: string;
}

interface UiConfig {
  length: boolean;
  breadth: boolean;
  height: boolean;
  weight: boolean;
}

const DEFAULT_UI_CONFIG: UiConfig = { length: true, breadth: true, height: true, weight: true };
const UI_CONFIG_KEY = "uiConfig";

function loadUiConfig(): UiConfig {
  if (typeof window === "undefined") return DEFAULT_UI_CONFIG;
  try {
    const raw = window.localStorage.getItem(UI_CONFIG_KEY);
    if (!raw) return DEFAULT_UI_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_UI_CONFIG, ...parsed };
  } catch {
    return DEFAULT_UI_CONFIG;
  }
}

function isPositiveDecimal(v: string) {
  if (!v.trim()) return false;
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
}

export default function OmsCaptureSkuDimensionsPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader
        title="INCREFF OMS"
        showTraining
        onStartTraining={() => startTraining(CaptureSkuDimensionsTour)}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Capture SKU Dimensions" }]} />
      <div className="product-page-body p-5">
        <OmsCaptureSkuDimensionsContent />
      </div>
    </>
  );
}

function OmsCaptureSkuDimensionsContent() {
  const [client, setClient] = useState("test11");
  const [skuInput, setSkuInput] = useState("");
  const [activeSku, setActiveSku] = useState<string | null>(null);
  // Lazy initializer: uiConfig only affects fields rendered after a SKU is scanned, so
  // reading localStorage here (a no-op on the server) can't cause a hydration mismatch.
  const [uiConfig, setUiConfig] = useState<UiConfig>(() => loadUiConfig());
  const [draftConfig, setDraftConfig] = useState<UiConfig>(() => loadUiConfig());
  const [values, setValues] = useState<DimensionValues>({ length: "", breadth: "", height: "", weight: "" });
  /** In-memory "database" — SKUs already saved once show pre-filled values on the next scan. */
  const [saved, setSaved] = useState<Record<string, DimensionValues>>({});
  const fieldRefs = {
    length: useRef<HTMLInputElement>(null),
    breadth: useRef<HTMLInputElement>(null),
    height: useRef<HTMLInputElement>(null),
    weight: useRef<HTMLInputElement>(null),
  };

  const visibleDimensionKeys = (["length", "breadth", "height", "weight"] as const).filter((k) => uiConfig[k]);
  const record = activeSku ? SKU_MASTER[activeSku] : null;

  const handleScan = () => {
    const id = skuInput.trim().toUpperCase();
    if (!id || !SKU_MASTER[id]) {
      showToast("SKU not found");
      return;
    }
    setActiveSku(id);
    setValues(saved[id] || { length: "", breadth: "", height: "", weight: "" });
    // Cursor auto-focus moves to the first configured dimension field.
    setTimeout(() => {
      const firstKey = visibleDimensionKeys[0];
      if (firstKey) fieldRefs[firstKey].current?.focus();
    }, 0);
  };

  const setValue = (key: keyof DimensionValues, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = () => {
    const dims = ["length", "breadth", "height"] as const;
    const filledDims = dims.filter((k) => uiConfig[k] && values[k].trim() !== "");
    const configuredDims = dims.filter((k) => uiConfig[k]);

    if (filledDims.length > 0 && filledDims.length < configuredDims.length) {
      showToast("Provide all three dimensions — length, breadth and height — or none");
      return;
    }
    for (const k of filledDims) {
      if (!isPositiveDecimal(values[k])) {
        showToast(`${k[0].toUpperCase()}${k.slice(1)} must be a decimal value greater than 0`);
        return;
      }
    }
    if (uiConfig.weight && values.weight.trim() !== "" && !isPositiveDecimal(values.weight)) {
      showToast("Weight must be a decimal value greater than 0");
      return;
    }

    if (!activeSku) return;
    setSaved((prev) => ({ ...prev, [activeSku]: values }));
    showToast("SKU dimensions saved successfully");
  };

  const handleFieldKeyDown = (key: (typeof visibleDimensionKeys)[number], e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const isLast = visibleDimensionKeys[visibleDimensionKeys.length - 1] === key;
    if (isLast) handleSubmit();
  };

  const openConfig = () => {
    setDraftConfig(uiConfig);
    document.getElementById("modal-dim-config")?.classList.add("open");
  };

  const saveConfig = () => {
    setUiConfig(draftConfig);
    window.localStorage.setItem(UI_CONFIG_KEY, JSON.stringify(draftConfig));
    closeModal("modal-dim-config");
    showToast("Configuration saved");
  };

  return (
    <div className="max-w-6xl">
      <div id="dim-top-bar" className="flex items-center justify-between mb-5">
        <div id="dim-sku-wrap" className="flex flex-col gap-1 max-w-[280px]">
          <label className="text-[13px] font-semibold text-slate-700">Client SKU</label>
          <div className="flex gap-2">
            <select
              id="dim-client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="h-9 px-2 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500"
            >
              {CLIENTS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              id="dim-sku-input"
              type="text"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleScan();
              }}
              placeholder="Scan or enter Client SKU ID"
              className={`h-9 px-2.5 border-b text-[13px] outline-none flex-1 ${
                activeSku ? "border-emerald-500" : "border-slate-300 focus:border-blue-500"
              }`}
            />
          </div>
        </div>
        <button
          id="dim-btn-config"
          onClick={openConfig}
          className="h-9 px-4 rounded border border-slate-300 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
        >
          &#9881; Configurations
        </button>
      </div>

      {activeSku && record ? (
        <div className="grid grid-cols-2 gap-10">
          <div id="dim-sku-details">
            <h3 className="text-[15px] font-semibold text-slate-800 mb-4">SKU Details</h3>
            <div className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 items-start">
              <div className="w-[140px] h-[140px] bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center text-center text-slate-400 text-[11px] font-semibold px-2 row-span-6">
                NO IMAGE AVAILABLE
              </div>
              <div className="text-[13px] font-semibold text-slate-800">Description</div>
              <div className="text-[13px] font-semibold text-slate-800">Brand</div>
              <div className="text-[13px] font-semibold text-slate-800">Category</div>
              <div className="text-[13px] font-semibold text-slate-800">Style</div>
              <div className="text-[13px] font-semibold text-slate-800">Color</div>
              <div className="text-[13px] font-semibold text-slate-800">MRP</div>
            </div>
            {/* Second column of values, aligned via a matching grid below the image */}
            <div className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 items-start -mt-[152px] ml-0">
              <div />
              <div className="text-[13px] text-slate-700">{record.description}</div>
              <div />
              <div className="text-[13px] text-slate-700">{record.brand}</div>
              <div />
              <div className="text-[13px] text-slate-700">{record.category}</div>
              <div />
              <div className="text-[13px] text-slate-700">{record.style}</div>
              <div />
              <div className="text-[13px] text-slate-700">{record.color}</div>
              <div />
              <div className="text-[13px] text-slate-700">{record.mrp} units</div>
            </div>
          </div>

          <div id="dim-fields">
            <h3 className="text-[15px] font-semibold text-slate-800 mb-4">SKU Dimensions</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-[440px]">
              {(["length", "breadth", "height", "weight"] as const).map((key) =>
                uiConfig[key] ? (
                  <div key={key} id={`dim-${key}-wrap`} className="flex flex-col gap-1">
                    <label className="text-[13px] font-medium text-slate-700 capitalize">{key}</label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`dim-${key}`}
                        ref={fieldRefs[key]}
                        type="text"
                        value={values[key]}
                        onChange={(e) => setValue(key, e.target.value)}
                        onKeyDown={(e) => handleFieldKeyDown(key, e)}
                        placeholder={`Enter ${key[0].toUpperCase()}${key.slice(1)}`}
                        className="h-9 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500 w-[140px]"
                      />
                      <span className="text-[12px] text-slate-500">unit</span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
            <button
              id="dim-btn-submit"
              onClick={handleSubmit}
              className="mt-6 h-9 px-5 rounded border border-blue-500 bg-white text-blue-600 text-[13px] font-semibold hover:bg-blue-50"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="text-[13px] text-slate-400 border border-dashed border-slate-300 rounded p-8 text-center">
          Scan or enter a Client SKU ID to load its details.
        </div>
      )}

      {/* Configurations modal */}
      <div
        id="modal-dim-config"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-dim-config-panel" className="bg-white rounded w-full max-w-[440px] shadow-xl relative">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">Configurations</h3>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <p className="text-[13px] text-slate-600 mb-1">
              Choose which fields this screen captures. All four are on by default.
            </p>
            {(["length", "breadth", "height", "weight"] as const).map((key) => (
              <label key={key} id={`dim-cfg-${key}-wrap`} className="flex items-center gap-2 text-[13px] cursor-pointer capitalize">
                <input
                  id={`dim-cfg-${key}`}
                  type="checkbox"
                  checked={draftConfig[key]}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="accent-blue-600"
                />
                {key}
              </label>
            ))}
          </div>
          <div id="modal-dim-config-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
            <button
              onClick={() => closeModal("modal-dim-config")}
              className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="dim-cfg-save"
              onClick={saveConfig}
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
