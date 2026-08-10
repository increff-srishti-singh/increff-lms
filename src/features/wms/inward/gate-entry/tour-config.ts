import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";
import { openModal, closeModal, showToast } from "@/shared/lib/tour-utils";

const HOME = "/";
const mod = getModule("wms")!;
const RESUME_KEY = "wmsTrainingResume";

function populateListResults() {
  const tbody = document.querySelector("#wms-results-table tbody");
  if (!tbody) return;
  tbody.innerHTML = `<tr>
    <td>GE-10042</td>
    <td>PO-12345</td>
    <td>Acme Supplies</td>
    <td>—</td>
    <td>Wed, 22 Jul 2026 IST</td>
    <td><span class="status-open">OPEN</span></td>
    <td class="action-cell">
      <a class="action-icon" href="/wms/receive-boxes" title="Receive Boxes">📦</a>
      <a class="action-icon" href="/wms/grn" title="GRN">☰</a>
      <button type="button" class="action-icon" title="Close Entry">⛔</button>
    </td>
  </tr>`;
}

function populateOrdersTable() {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;
  tbody.innerHTML =
    "<tr><td>RetailCorp India</td><td>Acme Supplies</td><td>IPO-55210</td><td>B2B</td><td>PO-12345</td><td>10-07-2026</td></tr>";
}

export const WmsListTour: TourConfig = {
  moduleId: "wms",
  pageKey: "wms-list",
  pageHref: "/wms/gate-entry",
  parentModuleName: "Gate Entry",
  learningModuleTitle: "Gate Entry (full flow)",
  learningModuleHref: "/wms/gate-entry",
  learningPageKey: "wms-list",
  track: "WMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["Gate Entry", "PO", "Client", "Supplier"],
  pitfalls: ["Creating without searching first", "Leaving Client blank when selecting orders", "Document No. not matching the invoice", "Entering qty that does not match the truck"],
  scenarios: [{ id: "acme-truck", title: "Acme truck at dock", story: "Acme at Dock 2 with PO-12345 / INV-12345. Search first, then create the entry." }],
  summary: {
    title: "Gate Entry — complete",
    intro: "You searched, linked a PO, and submitted a gate entry.",
    takeaways: ["Search before Add New Entry", "Client is required to find orders", "Match paperwork on Document No. and qty", "Submit when fields look right"],
    recap: ["No results? Check dates, supplier, Client", "Escalate qty mismatches", "Note Gate Entry ID after submit"],
  },
  quiz: [
    { question: "Before Add New Entry you should…", choices: ["Search first", "Skip filters", "Reset", "Change facility"], answer: 0, explain: "Avoid duplicate entries." },
    { question: "Required in Select New Orders?", choices: ["Supplier", "Client", "Remarks", "Page Size"], answer: 1, explain: "Client is marked *." },
    { question: "Truck qty ≠ invoice?", choices: ["Average it", "Escalate", "Leave blank", "Ignore"], answer: 1, explain: "Do not invent numbers." },
  ],
  steps: [
    { element: "#wms-search-by-wrap", title: "Search By", description: "Keep the default. Optional.", practicePrompt: "Date, Client and S...", expected: { type: "select", selector: "#wms-search-by", value: "date-client-supplier" }, skillLabel: "Search", skillIndex: 1 },
    { element: "#wms-start-date-wrap", title: "Start Date", description: "Optional. Example: <strong>16-06-2026</strong>", practicePrompt: "16-06-2026", expected: { type: "input", selector: "#wms-start-date", value: "16-06-2026" }, skillLabel: "Search", skillIndex: 1 },
    { element: "#wms-end-date-wrap", title: "End Date", description: "Optional. Example: <strong>15-07-2026</strong>", practicePrompt: "15-07-2026", expected: { type: "input", selector: "#wms-end-date", value: "15-07-2026" }, skillLabel: "Search", skillIndex: 1 },
    { element: "#wms-supplier-wrap", title: "Supplier", description: "Optional. Example: <strong>Acme Supplies</strong>", practicePrompt: "Acme Supplies", expected: { type: "select", selector: "#wms-supplier", value: "acme" }, skillLabel: "Search", skillIndex: 1 },
    { element: "#wms-btn-search", title: "Search", description: "Load results.", expected: { type: "action" }, onWatchFill: populateListResults, skillLabel: "Search", skillIndex: 1 },
    { element: "#wms-results-table", title: "Results", description: "Check if entry already exists.", expected: { type: "action" }, onEnter: populateListResults, side: "top", skillLabel: "Search", skillIndex: 1 },
    { element: "#wms-btn-add", title: "Add New Entry", description: "Go to create form.", expected: { type: "action" }, skillLabel: "Create", skillIndex: 2, navigateTo: "/wms/gate-entry/new", navigateStorageKey: RESUME_KEY },
  ],
};

export const WmsFormTour: TourConfig = {
  moduleId: "wms",
  pageKey: "wms-form",
  pageHref: "/wms/gate-entry/new",
  parentModuleName: "New Inward Gate Entry",
  learningModuleTitle: "Gate Entry (full flow)",
  learningModuleHref: "/wms/gate-entry",
  learningPageKey: "wms-list",
  track: "WMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["Gate Entry", "PO", "Client", "Supplier", "LR"],
  pitfalls: ["Creating without searching first", "Leaving Client blank when selecting orders", "Document No. not matching the invoice", "Entering qty that does not match the truck"],
  scenarios: [{ id: "acme-truck", title: "Acme truck at dock", story: "Select the PO and fill the gate entry form." }],
  summary: {
    title: "Gate Entry — complete",
    intro: "You searched, linked a PO, and submitted a gate entry.",
    takeaways: ["Search before Add New Entry", "Client is required to find orders", "Match paperwork on Document No. and qty", "Submit when fields look right"],
    recap: ["No results? Check dates, supplier, Client", "Escalate qty mismatches", "Note Gate Entry ID after submit"],
  },
  quiz: [
    { question: "Before Add New Entry you should…", choices: ["Search first", "Skip filters", "Reset", "Change facility"], answer: 0, explain: "Avoid duplicate entries." },
    { question: "Required in Select New Orders?", choices: ["Supplier", "Client", "Remarks", "Page Size"], answer: 1, explain: "Client is marked *." },
    { question: "Truck qty ≠ invoice?", choices: ["Average it", "Escalate", "Leave blank", "Ignore"], answer: 1, explain: "Do not invent numbers." },
  ],
  steps: [
    {
      element: "#field-po-sto",
      title: "PO / STO *",
      description: "Required. Link a purchase order here. Click <strong>Next</strong> to open Select.",
      required: true,
      expected: { type: "action" },
      onEnter: () => closeModal("modal-select-orders"),
      openModalOnNext: "modal-select-orders",
      side: "right",
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#modal-select-orders-panel",
      title: "Select New Orders",
      description: "Find and pick the PO for this gate entry.",
      expected: { type: "action" },
      onEnter: () => openModal("modal-select-orders"),
      side: "bottom",
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-start-wrap",
      title: "Start Date",
      description: "Optional. Example: <strong>16-06-2026</strong>",
      practicePrompt: "16-06-2026",
      expected: { type: "input", selector: "#orders-start-date", value: "16-06-2026" },
      onEnter: () => openModal("modal-select-orders"),
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-end-wrap",
      title: "End Date",
      description: "Optional. Example: <strong>15-07-2026</strong>",
      practicePrompt: "15-07-2026",
      expected: { type: "input", selector: "#orders-end-date", value: "15-07-2026" },
      onEnter: () => openModal("modal-select-orders"),
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-client-wrap",
      title: "Client *",
      description: "Required. Choose <strong>RetailCorp India</strong>.",
      practicePrompt: "RetailCorp India",
      required: true,
      commonMistakes: "Empty Client → no results.",
      expected: { type: "select", selector: "#orders-client", value: "retailcorp" },
      onEnter: () => openModal("modal-select-orders"),
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-supplier-wrap",
      title: "Supplier",
      description: "Optional. Example: <strong>Acme Supplies</strong>",
      practicePrompt: "Acme Supplies",
      expected: { type: "select", selector: "#orders-supplier", value: "acme" },
      onEnter: () => openModal("modal-select-orders"),
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-po-wrap",
      title: "External PO",
      description: "Optional. Example: <strong>PO-12345</strong>",
      practicePrompt: "PO-12345",
      expected: { type: "input", selector: "#orders-external-po", value: "PO-12345" },
      onEnter: () => openModal("modal-select-orders"),
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-btn-search",
      title: "Search",
      description: "Find the order.",
      expected: { type: "action" },
      onEnter: () => openModal("modal-select-orders"),
      onWatchFill: populateOrdersTable,
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#orders-results-table",
      title: "Pick order",
      description: "Select the matching row.",
      expected: { type: "action" },
      onEnter: () => {
        openModal("modal-select-orders");
        populateOrdersTable();
        const btn = document.getElementById("btn-select-po");
        if (btn) btn.textContent = "PO-12345";
      },
      side: "top",
      skillLabel: "Select PO",
      skillIndex: 2,
    },
    {
      element: "#field-doc-type",
      title: "Document Type *",
      description: "Required. <strong>Invoice</strong>",
      practicePrompt: "Invoice",
      required: true,
      expected: { type: "select", selector: "#wms-doc-type", value: "Invoice" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "right",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-doc-no",
      title: "Document No. *",
      description: "Required. <strong>INV-12345</strong>",
      practicePrompt: "INV-12345",
      required: true,
      expected: { type: "input", selector: "#wms-doc-no", value: "INV-12345" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "right",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-doc-date",
      title: "Document Date *",
      description: "Required. <strong>10-07-2026</strong>",
      practicePrompt: "10-07-2026",
      required: true,
      expected: { type: "input", selector: "#wms-doc-date", value: "10-07-2026" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "right",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-total-qty",
      title: "Quantity *",
      description: "Required. <strong>100</strong>",
      practicePrompt: "100",
      required: true,
      expected: { type: "input", selector: "#wms-total-qty", value: "100" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "right",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-total-value",
      title: "Value *",
      description: "Required. <strong>5000</strong>",
      practicePrompt: "5000",
      required: true,
      expected: { type: "input", selector: "#wms-total-value", value: "5000" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "right",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-transporter",
      title: "Transporter *",
      description: "Required. <strong>FastLogistics</strong>",
      practicePrompt: "FastLogistics",
      required: true,
      expected: { type: "input", selector: "#wms-transporter", value: "FastLogistics" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "left",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-vehicle",
      title: "Vehicle No. *",
      description: "Required. <strong>KA-01-1234</strong>",
      practicePrompt: "KA-01-1234",
      required: true,
      expected: { type: "input", selector: "#wms-vehicle", value: "KA-01-1234" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "left",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-material-date",
      title: "Received On *",
      description: "Required. <strong>15-07-2026</strong>",
      practicePrompt: "15-07-2026",
      required: true,
      expected: { type: "input", selector: "#wms-material-date", value: "15-07-2026" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "left",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#field-lr-no",
      title: "LR No.",
      description: "Optional. <strong>LR-77821</strong>",
      practicePrompt: "LR-77821",
      expected: { type: "input", selector: "#wms-lr-no", value: "LR-77821" },
      onEnter: () => closeModal("modal-select-orders"),
      side: "left",
      skillLabel: "Form",
      skillIndex: 3,
    },
    {
      element: "#form-actions",
      title: "Submit",
      description: "Use <strong>Submit</strong> to save, or <strong>Submit and Receive Boxes</strong> to open Receive Inward Boxes next.",
      expected: { type: "action" },
      onEnter: () => closeModal("modal-select-orders"),
      onWatchFill: () => showToast("Successful"),
      side: "top",
      skillLabel: "Submit",
      skillIndex: 4,
    },
  ],
};
