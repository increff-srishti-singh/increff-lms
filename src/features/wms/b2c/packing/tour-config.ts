import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const packingMod = getModule("wms-packing")!;
const manifestMod = getModule("wms-manifest")!;
const handoverMod = getModule("wms-handover")!;
const PACK_RESUME = "wmsB2cPackResume";

export const PackingTour: TourConfig = {
  moduleId: "wms-packing",
  pageKey: "wms-packing",
  pageHref: "/wms/packing",
  parentModuleName: "Piece Packing",
  track: "WMS",
  number: packingMod.number,
  title: packingMod.title,
  skills: packingMod.skills,
  homeHref: HOME,
  glossaryKeys: ["AWB", "Manifest", "Handover", "Channel"],
  pitfalls: ["Clicking Complete Packing before all items are scanned", "Forgetting to scan AWB after printing the label", "Packing expired / QC-fail items"],
  scenarios: [{ id: "pack-single", title: "Pack a single-piece order", story: "Scan item → Complete Packing → print invoice/label → scan AWB → continue to Manifest." }],
  summary: {
    title: "B2C Packing — complete",
    intro: "You packed an order, built a manifest, and practiced handover.",
    takeaways: ["Complete Packing only when pending items = 0", "Print invoice & shipping label, then scan AWB", "Create Manifest → scan AWBs → Close → Print", "Handover by manifest or AWB; remove rejected AWBs"],
    recap: ["Print two manifest copies for the dock", "Capture pickup rejection details for follow-up", "Upload POD / file copies after handover"],
  },
  quiz: [
    { question: "Complete Packing enables when…", choices: ["Any item is scanned", "All order items are scanned", "Manifest is closed", "AWB is blank"], answer: 1, explain: "Prevents incomplete packing." },
    { question: "After Close Manifest you typically…", choices: ["Start Gate Entry", "Print manifest & hand over", "GRN the boxes", "Open putaway"], answer: 1, explain: "Then Piece Order Handover to transporter." },
  ],
  steps: [
    { element: "#pack-item-code", title: "Scan Item Code", description: "Scan Item ID for the order. Example: <strong>ITM-441001</strong>", practicePrompt: "ITM-441001", required: true, expected: { type: "input", selector: "#pack-item-code", value: "ITM-441001" }, skillLabel: "Pack", skillIndex: 1 },
    { element: "#pack-status-panel", title: "Items scanned", description: "Check <strong>Items Scanned</strong> vs <strong>Pending</strong>. Pending must be 0.", expected: { type: "action" }, skillLabel: "Pack", skillIndex: 1 },
    { element: "#pack-btn-complete", title: "Complete Packing", description: "Enabled only after all items are scanned.", expected: { type: "action" }, onWatchFill: () => { const btn = document.getElementById("pack-btn-complete") as HTMLButtonElement; if (btn) { btn.disabled = false; btn.click(); } }, skillLabel: "Pack", skillIndex: 1 },
    { element: "#pack-btn-print", title: "Print Invoice & Label", description: "Print invoice and shipping label, pack physically, paste label.", expected: { type: "action" }, onWatchFill: () => { const btn = document.getElementById("pack-btn-print") as HTMLButtonElement; if (btn) { btn.disabled = false; btn.click(); } }, skillLabel: "Label", skillIndex: 2 },
    { element: "#pack-awb", title: "Scan AWB", description: "Scan AWB from the shipping label. Example: <strong>AWB77821001</strong>", practicePrompt: "AWB77821001", required: true, expected: { type: "input", selector: "#pack-awb", value: "AWB77821001" }, skillLabel: "Label", skillIndex: 2 },
    { element: "#pack-link-manifest", title: "Next: Manifest", description: "Continue to create a transporter manifest.", expected: { type: "action" }, navigateTo: "/wms/manifests", navigateStorageKey: PACK_RESUME, skillLabel: "Manifest", skillIndex: 3 },
  ],
};

export const ManifestTour: TourConfig = {
  moduleId: "wms-manifest",
  pageKey: "wms-manifest",
  pageHref: "/wms/manifests",
  parentModuleName: "Manifests",
  track: "WMS",
  number: manifestMod.number,
  title: manifestMod.title,
  skills: manifestMod.skills,
  homeHref: HOME,
  glossaryKeys: ["Manifest", "AWB", "Channel"],
  pitfalls: ["Closing manifest before scanning all AWBs", "Selecting wrong transporter"],
  scenarios: [{ id: "create-manifest", title: "Create & close manifest", story: "Select Client/Channel/Transporter, create, scan AWBs, close and print." }],
  summary: PackingTour.summary,
  quiz: PackingTour.quiz,
  steps: [
    { element: "#manifest-tabs", title: "Manifest tabs", description: "Use <strong>Create Manifest</strong> for new, or <strong>Search</strong> to add to an open one.", expected: { type: "action" }, onEnter: () => { document.getElementById("tab-manifest-create")?.click(); }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-client", title: "Client", description: "Required. Example: <strong>RetailCorp India</strong>", practicePrompt: "retailcorp", required: true, expected: { type: "select", selector: "#mf-client", value: "retailcorp" }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-channel", title: "Channel", description: "Required. Example: <strong>Amazon</strong>", practicePrompt: "amazon", required: true, expected: { type: "select", selector: "#mf-channel", value: "amazon" }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-transporter", title: "Transporter", description: "Required. Example: <strong>Delhivery</strong>", practicePrompt: "delhivery", required: true, expected: { type: "select", selector: "#mf-transporter", value: "delhivery" }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-btn-create", title: "Create Manifest", description: "Generates Internal Manifest ID in <strong>OPEN</strong> status.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("mf-btn-create")?.click(); }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-awb", title: "Scan AWB", description: "Add shipments by scanning AWB. Example: <strong>AWB77821001</strong>", practicePrompt: "AWB77821001", required: true, expected: { type: "input", selector: "#mf-awb", value: "AWB77821001" }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-close-print", title: "Close & Print", description: "Close when all AWBs are added, then print (ops often print 2 copies).", expected: { type: "action" }, onWatchFill: () => { document.getElementById("mf-btn-close")?.click(); document.getElementById("mf-btn-print")?.click(); }, skillLabel: "Manifest", skillIndex: 3 },
    { element: "#mf-link-handover", title: "Next: Handover", description: "Hand shipments to the transporter.", expected: { type: "action" }, navigateTo: "/wms/handover", navigateStorageKey: PACK_RESUME, skillLabel: "Handover", skillIndex: 4 },
  ],
};

export const HandoverTour: TourConfig = {
  moduleId: "wms-handover",
  pageKey: "wms-handover",
  pageHref: "/wms/handover",
  parentModuleName: "Piece Order Handover",
  track: "WMS",
  number: handoverMod.number,
  title: handoverMod.title,
  skills: handoverMod.skills,
  homeHref: HOME,
  glossaryKeys: ["Handover", "AWB"],
  pitfalls: ["Confirming handover with rejected AWBs still listed", "Handing over before manifest is closed"],
  scenarios: [{ id: "handover-manifest", title: "Handover by manifest", story: "Load closed manifest MF-10088, review AWBs, confirm handover." }],
  summary: PackingTour.summary,
  quiz: PackingTour.quiz,
  steps: [
    { element: "#ho-mode-tabs", title: "Handover mode", description: "<strong>By Manifest ID</strong> loads all orders; <strong>By Individual AWBs</strong> adds one by one.", expected: { type: "action" }, onEnter: () => { document.getElementById("tab-ho-manifest")?.click(); }, skillLabel: "Handover", skillIndex: 4 },
    { element: "#ho-manifest-id", title: "Internal Manifest ID", description: "Example: <strong>MF-10088</strong>", practicePrompt: "MF-10088", required: true, expected: { type: "input", selector: "#ho-manifest-id", value: "MF-10088" }, skillLabel: "Handover", skillIndex: 4 },
    { element: "#ho-btn-load-manifest", title: "Load Manifest", description: "Review the order / AWB list before confirming.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("ho-btn-load-manifest")?.click(); }, skillLabel: "Handover", skillIndex: 4 },
    { element: "#ho-table", title: "Handover list", description: "Check shipments. Remove any pickup rejection via Scan AWB to Remove.", expected: { type: "action" }, side: "top", skillLabel: "Handover", skillIndex: 4 },
    { element: "#ho-remove-awb", title: "Remove rejected AWB", description: "If pickup rejects a shipment, scan it here before confirm.", expected: { type: "action" }, skillLabel: "Handover", skillIndex: 4 },
    { element: "#ho-btn-confirm", title: "Confirm Handover", description: "Confirms transporter pickup. Next: upload POD and file copies.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("ho-btn-confirm")?.click(); }, skillLabel: "Handover", skillIndex: 4 },
  ],
};
