import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("wms-grn")!;

export const GrnTour: TourConfig = {
  moduleId: "wms-grn",
  pageKey: "wms-grn",
  pageHref: "/wms/grn",
  parentModuleName: "GRN",
  track: "WMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["GRN", "QC", "Bin"],
  pitfalls: ["Skipping barcode / Item ID scan order", "QC Fail without selecting a reason", "Scanning wrong QC bin (pass vs fail)", "Starting GRN before boxes are confirmed"],
  scenarios: [
    {
      id: "qc-pass",
      title: "QC Pass",
      story: "Scan box → barcode → Item ID → Print QC Pass Bin → scan pass bin to finish.",
    },
    {
      id: "qc-fail",
      title: "QC Fail",
      story: "Scan box → barcode → Item ID → select fail reason → Print QC Fail Bin → scan fail bin.",
    },
  ],
  summary: {
    title: "GRN — complete",
    intro: "You scanned the inward box, validated the item, and moved it to a QC bin.",
    takeaways: ["Scan Inward Box → Barcode → Item ID → QC Bin", "Compare physical product to on-screen attributes", "QC Fail needs a reason + fail bin", "After GRN, putaway makes inventory LIVE"],
    recap: ["Print QC Pass/Fail Bin ID if labels are needed", "Configs live under Configurations (client-specific)", "Continue until every item in the box is done"],
  },
  quiz: [
    { question: "After scanning Item ID, item status is typically…", choices: ["LIVE", "NEW", "CLOSED", "PUTAWAY"], answer: 1, explain: "NEW until QC bin is scanned." },
    { question: "QC Fail requires…", choices: ["Only a fail bin", "Fail reason + fail bin", "Putaway first", "New Gate Entry"], answer: 1, explain: "Select reason, then scan QC Fail Bin ID." },
    { question: "Inventory becomes orderable after…", choices: ["Gate Entry", "Receive Boxes", "GRN only", "Putaway"], answer: 3, explain: "Putaway makes stock LIVE." },
  ],
  steps: [
    { element: "#grn-inward-box", title: "Inward Box Code", description: "Scan the sticker from Receive Inward Boxes. Example: <strong>IB-10042-001</strong>", practicePrompt: "IB-10042-001", required: true, expected: { type: "input", selector: "#grn-inward-box", value: "IB-10042-001" }, skillLabel: "Scan box", skillIndex: 1 },
    { element: "#grn-barcode-scan", title: "Scan Barcode", description: "Scan product barcode. System prints an Item ID sticker. Example: <strong>8901234567890</strong>", practicePrompt: "8901234567890", required: true, expected: { type: "input", selector: "#grn-barcode-scan", value: "8901234567890" }, skillLabel: "Barcode", skillIndex: 2 },
    { element: "#grn-readouts", title: "Attributes", description: "Barcode / Item Code appear here. Compare with the physical product before QC.", expected: { type: "action" }, skillLabel: "Validate", skillIndex: 2 },
    { element: "#grn-item-scan", title: "Scan Item ID", description: "Paste sticker on item, then scan it. Example: <strong>ITM-567890</strong>", practicePrompt: "ITM-567890", required: true, expected: { type: "input", selector: "#grn-item-scan", value: "ITM-567890" }, skillLabel: "Item ID", skillIndex: 3 },

    // QC Pass path
    { element: "#grn-btn-print-pass", title: "Print QC Pass Bin", description: "Click <strong>Print QC Pass Bin ID</strong>, then scan that bin to finish GRN.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("grn-btn-print-pass")?.click(); }, skillLabel: "QC bin", skillIndex: 4, scenarioIds: ["qc-pass"] },
    { element: "#grn-qc-bin", title: "Scan QC Bin ID", description: "Scan the pass bin. Example: <strong>BIN-PASS-01</strong>", practicePrompt: "BIN-PASS-01", required: true, expected: { type: "input", selector: "#grn-qc-bin", value: "BIN-PASS-01" }, skillLabel: "QC bin", skillIndex: 4, scenarioIds: ["qc-pass"] },

    // QC Fail path
    { element: "#grn-qc-reason", title: "QC Fail Reason", description: "Required for fail. Example: <strong>Damaged</strong>", practicePrompt: "Damaged", required: true, expected: { type: "select", selector: "#grn-qc-reason", value: "Damaged" }, skillLabel: "QC", skillIndex: 3, scenarioIds: ["qc-fail"] },
    { element: "#grn-btn-print-fail", title: "Print QC Fail Bin", description: "Click <strong>Print QC Fail Bin ID</strong>, then scan the fail bin.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("grn-btn-print-fail")?.click(); }, skillLabel: "QC bin", skillIndex: 4, scenarioIds: ["qc-fail"] },
    { element: "#grn-qc-bin", title: "Scan QC Fail Bin ID", description: "Scan the fail bin. Example: <strong>BIN-FAIL-01</strong>", practicePrompt: "BIN-FAIL-01", required: true, expected: { type: "input", selector: "#grn-qc-bin", value: "BIN-FAIL-01" }, skillLabel: "QC bin", skillIndex: 4, scenarioIds: ["qc-fail"] },

    { element: "#grn-btn-complete", title: "Complete Item GRN", description: "Item moves to GRN status. Continue for remaining items, then Put Away.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("grn-btn-complete")?.click(); }, skillLabel: "Finish", skillIndex: 4 },
  ],
};
