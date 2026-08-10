import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const pendingMod = getModule("wms-pick-pending")!;
const itemMod = getModule("wms-pick-item")!;
const PICK_RESUME = "wmsB2cPickResume";

export const PickPendingTour: TourConfig = {
  moduleId: "wms-pick-pending",
  pageKey: "wms-pick-pending",
  pageHref: "/wms/pick-pending",
  parentModuleName: "Piece Pick Pending",
  track: "WMS",
  number: pendingMod.number,
  title: pendingMod.title,
  skills: pendingMod.skills,
  homeHref: HOME,
  glossaryKeys: ["Piece Pick", "Express Picking", "SLA"],
  pitfalls: ["Ignoring oldest pick lists / present-day SLA", "Assigning pickers without checking zone pendency", "Mixing Express and Default without checking Pick Type"],
  scenarios: [{ id: "zone1-pending", title: "Monitor ZONE1 pendency", story: "Search ZONE1 (Both pick types), review aisle pending, then go pick items." }],
  summary: {
    title: "B2C Picking — complete",
    intro: "You monitored pending picks and practiced Piece Pick Item.",
    takeaways: ["Piece Pick Pending shows aisle-level unfinished picks", "NEW → ALLOCATED when a picker starts near the aisle", "Express toggle must match the released wave", "Scan Location ID before Item ID"],
    recap: ["Use Not Found only after confirming the item is missing", "Segregate single vs multi-item in the trolley", "Next: sorting / packing for outward"],
  },
  quiz: [
    { question: "Piece Pick Pending is used to…", choices: ["Pack orders", "Monitor aisle pick pendency", "Create manifests", "Close Gate Entry"], answer: 1, explain: "It shows items released but not yet picked." },
    { question: "Express Picking toggle ON shows…", choices: ["Default wave picks", "Express wave picks", "All putaway bins", "Gate entries"], answer: 1, explain: "Match the toggle to the picklist wave." },
  ],
  steps: [
    { element: "#ppp-zone", title: "Zone", description: "Select the zone to monitor. Example: <strong>ZONE1</strong>", practicePrompt: "ZONE1", required: true, expected: { type: "select", selector: "#ppp-zone", value: "ZONE1" }, skillLabel: "Monitor", skillIndex: 1 },
    { element: "#ppp-pick-type", title: "Pick Type", description: "Filter <strong>Default</strong>, <strong>Express</strong>, or <strong>Both</strong>.", expected: { type: "action" }, skillLabel: "Monitor", skillIndex: 1 },
    { element: "#ppp-btn-search", title: "Search", description: "Load aisle pending for the zone.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("ppp-btn-search")?.click(); }, skillLabel: "Monitor", skillIndex: 1 },
    { element: "#ppp-table", title: "Pending aisles", description: "Review Aisle, item count, Status, oldest pick list, and Required By (SLA).", expected: { type: "action" }, side: "top", skillLabel: "Assign", skillIndex: 2 },
    { element: "#ppp-zone-card", title: "Zone pendency", description: "Use zone totals to decide where to send pickers.", expected: { type: "action" }, skillLabel: "Assign", skillIndex: 2 },
    { element: "#ppp-link-pick", title: "Start picking", description: "Open <strong>Piece Pick Item</strong> to scan locations and items.", expected: { type: "action" }, navigateTo: "/wms/pick-item", navigateStorageKey: PICK_RESUME, skillLabel: "Pick", skillIndex: 3 },
  ],
};

export const PickItemTour: TourConfig = {
  moduleId: "wms-pick-item",
  pageKey: "wms-pick-item",
  pageHref: "/wms/pick-item",
  parentModuleName: "Piece Pick Item",
  track: "WMS",
  number: itemMod.number,
  title: itemMod.title,
  skills: itemMod.skills,
  homeHref: HOME,
  glossaryKeys: ["Piece Pick", "Express Picking"],
  pitfalls: ["Wrong Express toggle vs released wave", "Scanning wrong SKU or wrong bin", "Marking Not Found without supervisor check"],
  scenarios: [{ id: "aisle-pick", title: "Pick from aisle", story: "Keep Express OFF for default wave. Scan location, then item." }],
  summary: PickPendingTour.summary,
  quiz: PickPendingTour.quiz,
  steps: [
    { element: "#ppi-express-toggle", title: "Express Picking", description: "Keep <strong>OFF</strong> for default wave; turn <strong>ON</strong> only for express picklists.", expected: { type: "action" }, skillLabel: "Pick", skillIndex: 3 },
    { element: "#ppi-location", title: "Scan Location ID", description: "Scan the first location of the aisle. Example: <strong>A-12-04</strong>", practicePrompt: "A-12-04", required: true, expected: { type: "input", selector: "#ppi-location", value: "A-12-04" }, skillLabel: "Pick", skillIndex: 3 },
    { element: "#ppi-attrs", title: "Pick suggestion", description: "System shows Pack Type, Bin, SKUs, and order type.", expected: { type: "action" }, skillLabel: "Pick", skillIndex: 3 },
    { element: "#ppi-item-code", title: "Scan Item Code", description: "Pick the SKU from the bin and scan Item ID. Example: <strong>ITM-441001</strong>", practicePrompt: "ITM-441001", required: true, expected: { type: "input", selector: "#ppi-item-code", value: "ITM-441001" }, skillLabel: "Confirm", skillIndex: 4 },
    { element: "#ppi-actions", title: "Confirm Pick", description: "Confirm the pick. Use <strong>Not Found</strong> only if the item is missing.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("ppi-btn-pick")?.click(); }, skillLabel: "Confirm", skillIndex: 4 },
  ],
};
