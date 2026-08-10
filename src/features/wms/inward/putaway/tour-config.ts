import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("wms-putaway")!;

export const PutawayTour: TourConfig = {
  moduleId: "wms-putaway",
  pageKey: "wms-putaway",
  pageHref: "/wms/putaway",
  parentModuleName: "Put Away",
  track: "WMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["Putaway", "Bin", "Location"],
  pitfalls: ["Physically placing bins then mapping later (mismatch risk)", "Confirm Location not matching first Location scan", "Using Bin Transfer when location is empty (use Bin Putaway)", "Skipping putaway — stock stays offline for orders"],
  scenarios: [{ id: "all-putaway", title: "All three putaway methods", story: "Practice Bin Putaway, then Bin Transfer, then Item Putaway so inventory goes LIVE." }],
  summary: {
    title: "Put Away — complete",
    intro: "You practiced Bin Putaway, Bin Transfer, and Item Putaway so GRNed stock becomes LIVE.",
    takeaways: ["Bin Putaway = whole bin to empty location", "Bin Transfer = source bin → static destination bin", "Item Putaway = scan bin then each item", "Putaway in system and on floor together"],
    recap: ["Use Get Empty Location to find space", "Always re-confirm location / destination", "Green/live vs red/offline bin status on Item Putaway"],
  },
  quiz: [
    { question: "Move a full GRN bin to an empty rack slot with…", choices: ["Item Putaway", "Bin Putaway", "Receive Boxes", "Gate Entry"], answer: 1, explain: "Bin Putaway targets empty locations." },
    { question: "Static bin already at location — use…", choices: ["Bin Transfer", "Bin Putaway only", "Close Gate Entry", "Map ASN"], answer: 0, explain: "Transfer from source to destination bin." },
    { question: "Stock is orderable when…", choices: ["GRN finishes", "Putaway completes", "Boxes printed", "PO selected"], answer: 1, explain: "LIVE after putaway." },
  ],
  steps: [
    // Bin Putaway
    { element: "#putaway-tabs", title: "Putaway methods", description: "Three ways: <strong>Bin Putaway</strong>, <strong>Bin Transfer</strong>, <strong>Item Putaway</strong>. Start with Bin Putaway.", expected: { type: "action" }, onEnter: () => { document.getElementById("tab-bin-putaway")?.click(); }, skillLabel: "Method", skillIndex: 1 },
    { element: "#bp-get-location", title: "Get Empty Location", description: "Scan first location of the aisle. Example: <strong>A-12-01</strong>", practicePrompt: "A-12-01", required: true, expected: { type: "input", selector: "#bp-get-location", value: "A-12-01" }, skillLabel: "Find slot", skillIndex: 2 },
    { element: "#bp-suggested", title: "Suggested location", description: "Move the putaway bin physically to the suggested empty location.", expected: { type: "action" }, skillLabel: "Find slot", skillIndex: 2 },
    { element: "#bp-location", title: "Scan Location ID", description: "Scan the empty location. Example: <strong>A-12-04</strong>", practicePrompt: "A-12-04", required: true, expected: { type: "input", selector: "#bp-location", value: "A-12-04" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#bp-bin", title: "Scan Bin ID", description: "Place the bin, then scan it. Example: <strong>BIN-PASS-01</strong>", practicePrompt: "BIN-PASS-01", required: true, expected: { type: "input", selector: "#bp-bin", value: "BIN-PASS-01" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#bp-confirm", title: "Confirm Location ID", description: "Re-scan the same location. Example: <strong>A-12-04</strong>", practicePrompt: "A-12-04", required: true, expected: { type: "input", selector: "#bp-confirm", value: "A-12-04" }, skillLabel: "Confirm", skillIndex: 4 },
    { element: "#bp-btn-complete", title: "Complete Bin Putaway", description: "Bin is at the empty location. Next: <strong>Bin Transfer</strong>.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("bp-btn-complete")?.click(); }, switchTabOnNext: "#tab-bin-transfer", skillLabel: "Confirm", skillIndex: 4 },
    // Bin Transfer
    { element: "#tab-bin-transfer", title: "Bin Transfer tab", description: "Use when a <strong>static bin</strong> already sits at the location.", expected: { type: "action" }, onEnter: () => { document.getElementById("tab-bin-transfer")?.click(); }, skillLabel: "Method", skillIndex: 1 },
    { element: "#bt-get-location", title: "Get Location with Empty Bin", description: "Scan aisle start to find an empty bin. Example: <strong>B-03-01</strong>", practicePrompt: "B-03-01", required: true, expected: { type: "input", selector: "#bt-get-location", value: "B-03-01" }, skillLabel: "Find slot", skillIndex: 2 },
    { element: "#bt-suggested", title: "Suggested empty bin", description: "Move the source putaway bin to the suggested destination.", expected: { type: "action" }, skillLabel: "Find slot", skillIndex: 2 },
    { element: "#bt-dest", title: "Destination Bin ID", description: "Scan the empty destination bin. Example: <strong>BIN-DEST-07</strong>", practicePrompt: "BIN-DEST-07", required: true, expected: { type: "input", selector: "#bt-dest", value: "BIN-DEST-07" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#bt-source", title: "Source Bin ID", description: "Scan the GRN / putaway source bin. Example: <strong>BIN-PASS-01</strong>", practicePrompt: "BIN-PASS-01", required: true, expected: { type: "input", selector: "#bt-source", value: "BIN-PASS-01" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#bt-confirm", title: "Confirm Destination Bin", description: "Re-scan destination. Example: <strong>BIN-DEST-07</strong>", practicePrompt: "BIN-DEST-07", required: true, expected: { type: "input", selector: "#bt-confirm", value: "BIN-DEST-07" }, skillLabel: "Confirm", skillIndex: 4 },
    { element: "#bt-btn-complete", title: "Complete Transfer", description: "Quantity moves to the destination bin. Next: <strong>Item Putaway</strong>.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("bt-btn-complete")?.click(); }, switchTabOnNext: "#tab-item-putaway", skillLabel: "Confirm", skillIndex: 4 },
    // Item Putaway
    { element: "#tab-item-putaway", title: "Item Putaway tab", description: "Use when putting away <strong>individual items</strong> into a bin.", expected: { type: "action" }, onEnter: () => { document.getElementById("tab-item-putaway")?.click(); }, skillLabel: "Method", skillIndex: 1 },
    { element: "#ip-bin", title: "Scan Bin ID", description: "Scan the putaway bin. Example: <strong>BIN-DEST-07</strong>", practicePrompt: "BIN-DEST-07", required: true, expected: { type: "input", selector: "#ip-bin", value: "BIN-DEST-07" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#ip-status", title: "Bin Status", description: "Shows Offline / GRN before putaway; turns Live after items are put away.", expected: { type: "action" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#ip-item", title: "Item Code", description: "Scan each item into the bin. Example: <strong>ITM-567890</strong>", practicePrompt: "ITM-567890", required: true, expected: { type: "input", selector: "#ip-item", value: "ITM-567890" }, skillLabel: "Place bin", skillIndex: 3 },
    { element: "#ip-btn-complete", title: "Put Away Item", description: "Item is in the bin. Inventory becomes <strong>LIVE</strong> for orders.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("ip-btn-complete")?.click(); }, skillLabel: "Confirm", skillIndex: 4 },
  ],
};
