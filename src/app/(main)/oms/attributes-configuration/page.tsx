"use client";

import { useState } from "react";
import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { AttributesConfigTour } from "@/features/oms/attributes-configuration/tour-config";
import { showToast, closeModal } from "@/shared/lib/tour-utils";

/**
 * Length / Breadth / Height are "handled specially" per the notes: they share one
 * displayable/highlightable state as a group, with their own headroom separate from
 * the normal 10-attribute cap. Toggling any one of them toggles all three.
 */
const DIMENSION_KEYS = ["length", "breadth", "height"] as const;
const NORMAL_DISPLAY_CAP = 10;
const HIGHLIGHT_CAP = 2;

interface StandardAttr {
  key: string;
  name: string;
  displayed: boolean;
  highlighted: boolean;
  /** No pencil — a core/system field the client cannot toggle. */
  locked: boolean;
}

/**
 * 8 of these rows (Brand, Breadth, Bulk Break Threshold, Category, Color, GRN Tolerance
 * Days, Height, Hsn ID) are confirmed from the product screenshot. The remaining 9 are
 * extrapolated from the notes' own field list to reach the confirmed 17-row total —
 * Description, Image Url, Length, MRP, Name, Return Tolerance Days, Size, Style, Tax Rule.
 * Display state: 9 normal attributes displayed (1 slot short of the 10 cap, so the tour
 * can demonstrate adding a 10th), plus the Length/Breadth/Height trio displayed under its
 * own separate headroom. Highlighted: the dimension trio counts as one unit, plus MRP —
 * 2 of 2 units used.
 */
const INITIAL_STANDARD: StandardAttr[] = [
  { key: "brand", name: "Brand", displayed: true, highlighted: false, locked: false },
  { key: "breadth", name: "Breadth", displayed: true, highlighted: true, locked: false },
  { key: "bulkBreakThreshold", name: "Bulk Break Threshold", displayed: false, highlighted: false, locked: true },
  { key: "category", name: "Category", displayed: false, highlighted: false, locked: true },
  { key: "color", name: "Color", displayed: true, highlighted: false, locked: false },
  { key: "description", name: "Description", displayed: true, highlighted: false, locked: false },
  { key: "grnToleranceDays", name: "GRN Tolerance Days", displayed: true, highlighted: false, locked: false },
  { key: "height", name: "Height", displayed: true, highlighted: true, locked: false },
  { key: "hsnId", name: "Hsn ID", displayed: false, highlighted: false, locked: true },
  { key: "imageUrl", name: "Image Url", displayed: false, highlighted: false, locked: false },
  { key: "length", name: "Length", displayed: true, highlighted: true, locked: false },
  { key: "mrp", name: "MRP", displayed: true, highlighted: true, locked: false },
  { key: "name", name: "Name", displayed: true, highlighted: false, locked: true },
  { key: "returnToleranceDays", name: "Return Tolerance Days", displayed: true, highlighted: false, locked: false },
  { key: "size", name: "Size", displayed: true, highlighted: false, locked: false },
  { key: "style", name: "Style", displayed: true, highlighted: false, locked: false },
  { key: "taxRule", name: "Tax Rule", displayed: false, highlighted: false, locked: false },
];

interface CustomAttr {
  id: string;
  attributeKey: string; // "Attribute1".."Attribute15"
  name: string;
  displayed: boolean;
  highlighted: boolean;
  searchable: boolean;
}

const ATTRIBUTE_KEYS = Array.from({ length: 15 }, (_, i) => `Attribute${i + 1}`);
/** Only the first five custom attribute keys can ever be searchable — structural, not a count cap. */
const SEARCHABLE_KEY_LIMIT = 5;

function isDimensionKey(key: string) {
  return (DIMENSION_KEYS as readonly string[]).includes(key);
}

export default function OmsAttributesConfigurationPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(AttributesConfigTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Attributes Configuration" }]} />
      <div className="product-page-body p-5">
        <OmsAttributesConfigurationContent />
      </div>
    </>
  );
}

function OmsAttributesConfigurationContent() {
  const [tab, setTab] = useState("standard");
  const [standardAttrs, setStandardAttrs] = useState<StandardAttr[]>(INITIAL_STANDARD);
  const [customAttrs, setCustomAttrs] = useState<CustomAttr[]>([]);
  const [editingStandardKey, setEditingStandardKey] = useState<string | null>(null);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [newAttrKey, setNewAttrKey] = useState("");
  const [newAttrName, setNewAttrName] = useState("");

  const normalDisplayedCount = standardAttrs.filter((a) => a.displayed && !isDimensionKey(a.key)).length;
  const dimensionDisplayed = standardAttrs.some((a) => isDimensionKey(a.key) && a.displayed);
  const dimensionHighlighted = standardAttrs.some((a) => isDimensionKey(a.key) && a.highlighted);
  const normalHighlightedCount = standardAttrs.filter((a) => a.highlighted && !isDimensionKey(a.key)).length;
  const customHighlightedCount = customAttrs.filter((c) => c.highlighted).length;
  const highlightUnitsUsed = (dimensionHighlighted ? 1 : 0) + normalHighlightedCount + customHighlightedCount;

  const editingStandard = standardAttrs.find((a) => a.key === editingStandardKey) || null;
  const editingCustom = customAttrs.find((c) => c.id === editingCustomId) || null;

  const applyStandardEdit = (displayed: boolean, highlighted: boolean) => {
    if (!editingStandard) return;
    setStandardAttrs((prev) =>
      prev.map((a) => {
        const sameGroup = isDimensionKey(editingStandard.key) && isDimensionKey(a.key);
        if (a.key === editingStandard.key || sameGroup) {
          return { ...a, displayed, highlighted: displayed ? highlighted : false };
        }
        return a;
      })
    );
    setEditingStandardKey(null);
    closeModal("modal-edit-standard-attr");
    showToast("Attribute updated successfully");
  };

  const usedCustomKeys = new Set(customAttrs.map((c) => c.attributeKey));
  const availableKeys = ATTRIBUTE_KEYS.filter((k) => !usedCustomKeys.has(k));

  const handleAddCustom = () => {
    const key = newAttrKey || availableKeys[0];
    if (!key || !newAttrName.trim()) return;
    const created: CustomAttr = {
      // The attribute key is already unique per client and can't be reused once taken.
      id: key,
      attributeKey: key,
      name: newAttrName.trim(),
      displayed: false,
      highlighted: false,
      searchable: false,
    };
    setCustomAttrs((prev) => [...prev, created]);
    setNewAttrKey("");
    setNewAttrName("");
    closeModal("modal-add-custom-attr");
    showToast("Custom SKU attribute created successfully");
  };

  const applyCustomEdit = (displayed: boolean, highlighted: boolean, searchable: boolean) => {
    if (!editingCustom) return;
    setCustomAttrs((prev) =>
      prev.map((c) =>
        c.id === editingCustom.id
          ? { ...c, displayed, highlighted: displayed ? highlighted : false, searchable: displayed ? searchable : false }
          : c
      )
    );
    setEditingCustomId(null);
    closeModal("modal-edit-custom-attr");
    showToast("Custom SKU attribute updated successfully");
  };

  const deleteCustom = (id: string) => {
    setCustomAttrs((prev) => prev.filter((c) => c.id !== id));
    showToast("Custom SKU attribute deleted");
  };

  return (
    <div className="max-w-6xl">
      {/* Tabs */}
      <div id="attr-tabs" className="flex gap-0 mb-0">
        {[
          { id: "standard", label: "Standard SKU Attributes" },
          { id: "custom", label: "Custom SKU Attributes" },
        ].map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 bg-transparent border-none border-b-2 text-xs font-semibold -mb-px cursor-pointer ${
              tab === t.id
                ? "text-blue-600 border-b-blue-600 bg-white border border-slate-300 rounded-t"
                : "text-blue-500 border-b-transparent hover:text-blue-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-b rounded-tr p-5">
        {tab === "standard" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-slate-800">Standard SKU Attributes</h3>
              <span id="attr-standard-count" className="text-[13px] text-slate-500">
                Showing <strong>{standardAttrs.length}</strong> results
              </span>
            </div>
            <div
              id="attr-standard-caps"
              className="mb-4 flex flex-wrap gap-4 text-[12px] text-slate-600 bg-slate-50 border border-slate-200 rounded p-3"
            >
              <span>
                Displayable (normal): <strong>{normalDisplayedCount}</strong> / {NORMAL_DISPLAY_CAP}
              </span>
              <span>
                Dimensions (Length/Breadth/Height): {dimensionDisplayed ? "displayed as a group" : "not displayed"}
              </span>
              <span>
                Highlighted: <strong>{highlightUnitsUsed}</strong> / {HIGHLIGHT_CAP}
              </span>
            </div>

            <div id="attr-standard-table" className="border border-slate-200 rounded overflow-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    {["Properties", "Name"].map((h) => (
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
                  {standardAttrs.map((a) => (
                    <tr key={a.key} id={`attr-row-${a.key}`}>
                      <td className="px-3 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span
                            title={a.displayed ? "Displayed in WMS" : "Not displayed"}
                            className={`w-7 h-7 rounded flex items-center justify-center ${
                              a.displayed ? "bg-emerald-500 text-white" : "text-slate-500"
                            }`}
                          >
                            {a.displayed ? "\u{1F441}" : "\u{25CB}"}
                          </span>
                          {!a.locked && (
                            <button
                              id={`attr-edit-${a.key}`}
                              title="Edit"
                              onClick={() => {
                                setEditingStandardKey(a.key);
                                document.getElementById("modal-edit-standard-attr")?.classList.add("open");
                              }}
                              className="text-slate-600 hover:text-blue-600"
                            >
                              &#9998;
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100">{a.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "custom" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                id="attr-btn-add-custom"
                onClick={() => document.getElementById("modal-add-custom-attr")?.classList.add("open")}
                className="h-8 px-4 rounded bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700"
              >
                Add Custom Attribute
              </button>
              <span id="attr-custom-count" className="text-[13px] text-slate-500">
                Showing <strong>{customAttrs.length}</strong> results
              </span>
            </div>

            <h3 className="text-[15px] font-semibold text-slate-800 mb-3">Custom SKU Attributes</h3>
            <div id="attr-custom-table" className="border border-slate-200 rounded overflow-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    {["Properties", "Name", "Action"].map((h) => (
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
                  {customAttrs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-4 text-slate-500">
                        No Data to Show
                      </td>
                    </tr>
                  ) : (
                    customAttrs.map((c) => (
                      <tr key={c.id} id={`attr-custom-row-${c.id}`}>
                        <td className="px-3 py-3 border-b border-slate-100">
                          <span
                            title={c.displayed ? "Displayed in WMS" : "Not displayed"}
                            className={`w-7 h-7 rounded flex items-center justify-center ${
                              c.displayed ? "bg-emerald-500 text-white" : "text-slate-500"
                            }`}
                          >
                            {c.displayed ? "\u{1F441}" : "\u{25CB}"}
                          </span>
                        </td>
                        <td className="px-3 py-3 border-b border-slate-100">
                          {c.name} <span className="text-slate-400">({c.attributeKey})</span>
                        </td>
                        <td className="px-3 py-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <button
                              id={`attr-custom-edit-${c.id}`}
                              title="Edit"
                              onClick={() => {
                                setEditingCustomId(c.id);
                                document.getElementById("modal-edit-custom-attr")?.classList.add("open");
                              }}
                              className="text-slate-600 hover:text-blue-600"
                            >
                              &#9998;
                            </button>
                            <button
                              id={`attr-custom-delete-${c.id}`}
                              title={c.searchable ? "Searchable attributes cannot be removed" : "Delete"}
                              disabled={c.searchable}
                              onClick={() => deleteCustom(c.id)}
                              className={c.searchable ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:text-red-600"}
                            >
                              &#128465;
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Edit Standard Attribute modal */}
      <div
        id="modal-edit-standard-attr"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-edit-standard-panel" className="bg-white rounded w-full max-w-[520px] shadow-xl relative">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">Edit Attribute — {editingStandard?.name}</h3>
          </div>
          <EditAttrForm
            key={editingStandard?.key}
            idPrefix="standard"
            isDimension={editingStandard ? isDimensionKey(editingStandard.key) : false}
            initialDisplayed={editingStandard?.displayed ?? false}
            initialHighlighted={editingStandard?.highlighted ?? false}
            highlightBlocked={
              !!editingStandard &&
              !editingStandard.highlighted &&
              !(isDimensionKey(editingStandard.key) && dimensionHighlighted) &&
              highlightUnitsUsed >= HIGHLIGHT_CAP
            }
            showSearchable={false}
            onCancel={() => {
              setEditingStandardKey(null);
              closeModal("modal-edit-standard-attr");
            }}
            onSubmit={(displayed, highlighted) => applyStandardEdit(displayed, highlighted)}
          />
        </div>
      </div>

      {/* Add Custom SKU Attribute modal */}
      <div
        id="modal-add-custom-attr"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-add-custom-panel" className="bg-white rounded w-full max-w-[560px] shadow-xl relative">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">Add Custom SKU Attribute</h3>
          </div>
          <div className="p-5 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div id="field-attr-key" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">Attribute Key</label>
                <select
                  id="new-attr-key"
                  value={newAttrKey || availableKeys[0] || ""}
                  onChange={(e) => setNewAttrKey(e.target.value)}
                  className="h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select an Attribute Key
                  </option>
                  {availableKeys.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div id="field-attr-name" className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-slate-700">Attribute Name</label>
                <input
                  id="new-attr-name"
                  type="text"
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  placeholder="Attribute Name"
                  className="h-8 px-2.5 border-b border-slate-300 text-[13px] outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <div id="modal-add-custom-actions" className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
            <button
              onClick={() => {
                setNewAttrKey("");
                setNewAttrName("");
                closeModal("modal-add-custom-attr");
              }}
              className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="attr-btn-submit-custom"
              onClick={handleAddCustom}
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Edit Custom SKU Attribute modal */}
      <div
        id="modal-edit-custom-attr"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div id="modal-edit-custom-panel" className="bg-white rounded w-full max-w-[520px] shadow-xl relative">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">
              Edit Custom Attribute — {editingCustom?.name} ({editingCustom?.attributeKey})
            </h3>
          </div>
          <EditAttrForm
            key={editingCustom?.id}
            idPrefix="custom"
            isDimension={false}
            initialDisplayed={editingCustom?.displayed ?? false}
            initialHighlighted={editingCustom?.highlighted ?? false}
            highlightBlocked={!!editingCustom && !editingCustom.highlighted && highlightUnitsUsed >= HIGHLIGHT_CAP}
            showSearchable={
              !!editingCustom &&
              ATTRIBUTE_KEYS.indexOf(editingCustom.attributeKey) < SEARCHABLE_KEY_LIMIT
            }
            initialSearchable={editingCustom?.searchable ?? false}
            onCancel={() => {
              setEditingCustomId(null);
              closeModal("modal-edit-custom-attr");
            }}
            onSubmit={(displayed, highlighted, searchable) => applyCustomEdit(displayed, highlighted, !!searchable)}
          />
        </div>
      </div>
    </div>
  );
}

function EditAttrForm({
  idPrefix,
  isDimension,
  initialDisplayed,
  initialHighlighted,
  initialSearchable = false,
  highlightBlocked,
  showSearchable,
  onCancel,
  onSubmit,
}: {
  idPrefix: "standard" | "custom";
  isDimension: boolean;
  initialDisplayed: boolean;
  initialHighlighted: boolean;
  initialSearchable?: boolean;
  highlightBlocked: boolean;
  showSearchable: boolean;
  onCancel: () => void;
  onSubmit: (displayed: boolean, highlighted: boolean, searchable?: boolean) => void;
}) {
  const [displayed, setDisplayed] = useState(initialDisplayed);
  const [highlighted, setHighlighted] = useState(initialHighlighted);
  const [searchable, setSearchable] = useState(initialSearchable);

  return (
    <>
      <div className="p-5 flex flex-col gap-4">
        {isDimension && (
          <div id={`attr-dimension-note-${idPrefix}`} className="text-[13px] text-slate-600 bg-blue-50 border border-blue-100 rounded p-2.5">
            Length, Breadth and Height are handled as one group — this change applies to all three together, and
            counts separately from the normal 10-attribute display cap.
          </div>
        )}
        <div id={`field-attr-displayed-${idPrefix}`} className="flex flex-col gap-1">
          <label className="text-[13px] font-medium text-slate-700">Display in WMS Master Data</label>
          <div className="flex gap-5">
            {["TRUE", "FALSE"].map((v) => (
              <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                <input
                  type="radio"
                  name={`attr-displayed-${idPrefix}`}
                  value={v}
                  checked={(v === "TRUE") === displayed}
                  onChange={() => {
                    const next = v === "TRUE";
                    setDisplayed(next);
                    if (!next) {
                      setHighlighted(false);
                      setSearchable(false);
                    }
                  }}
                  className="accent-blue-600"
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        <div id={`field-attr-highlighted-${idPrefix}`} className="flex flex-col gap-1">
          <label className="text-[13px] font-medium text-slate-700">Highlight in WMS Master Data</label>
          <div className="flex gap-5">
            {["TRUE", "FALSE"].map((v) => {
              const wantsTrue = v === "TRUE";
              const disabled = !displayed || (wantsTrue && highlightBlocked && !highlighted);
              return (
                <label
                  key={v}
                  className={`flex items-center gap-1.5 text-[13px] ${disabled ? "text-slate-300 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="radio"
                    name={`attr-highlighted-${idPrefix}`}
                    value={v}
                    disabled={disabled}
                    checked={wantsTrue === highlighted}
                    onChange={() => setHighlighted(wantsTrue)}
                    className="accent-blue-600"
                  />
                  {v}
                </label>
              );
            })}
          </div>
          {!displayed && (
            <span className="text-[12px] text-slate-500">An attribute can only be highlighted if it is displayed.</span>
          )}
          {displayed && highlightBlocked && !highlighted && (
            <span className="text-[12px] text-amber-600">Highlight limit (2) reached — turn one off first.</span>
          )}
        </div>

        {showSearchable && (
          <div id={`field-attr-searchable-${idPrefix}`} className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-slate-700">Use as Search Field During GRN</label>
            <div className="flex gap-5">
              {["TRUE", "FALSE"].map((v) => {
                const wantsTrue = v === "TRUE";
                const disabled = !displayed;
                return (
                  <label
                    key={v}
                    className={`flex items-center gap-1.5 text-[13px] ${disabled ? "text-slate-300 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name={`attr-searchable-${idPrefix}`}
                      value={v}
                      disabled={disabled}
                      checked={wantsTrue === searchable}
                      onChange={() => setSearchable(wantsTrue)}
                      className="accent-blue-600"
                    />
                    {v}
                  </label>
                );
              })}
            </div>
            <span className="text-[12px] text-slate-500">
              Only Attribute1–Attribute5 can ever be searchable — this key qualifies.
            </span>
          </div>
        )}
      </div>
      <div id={`modal-edit-attr-actions-${idPrefix}`} className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
        <button
          onClick={onCancel}
          className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          id={`attr-btn-submit-edit-${idPrefix}`}
          onClick={() => onSubmit(displayed, highlighted, searchable)}
          className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </>
  );
}
