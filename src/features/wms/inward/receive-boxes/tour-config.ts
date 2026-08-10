import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("wms-receive")!;

export const ReceiveBoxesTour: TourConfig = {
  moduleId: "wms-receive",
  pageKey: "wms-receive",
  pageHref: "/wms/receive-boxes",
  parentModuleName: "Receive Inward Boxes",
  track: "WMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["Gate Entry", "Inward Box"],
  pitfalls: ["Starting GRN before Confirm on all boxes", "External toggle ON when boxes need WMS stickers", "Printing more than Max 500 in one batch", "Confirming with missing physical boxes"],
  scenarios: [{ id: "print-boxes", title: "Print internal box codes", story: "Gate Entry GE-10042 arrived with 3 boxes. Generate and print inward box stickers, then Confirm." }],
  summary: {
    title: "Receive Inward Boxes — complete",
    intro: "You linked inward box codes to the Gate Entry and confirmed receipt.",
    takeaways: ["Gate Entry must exist before receiving boxes", "Internal = print stickers; External = scan partner codes", "Confirm marks Gate Entry INWARD_BOX_RECEIVED", "GRN cannot start until boxes are confirmed"],
    recap: ["Max 500 boxes per print batch", "Missing ASN boxes can be NOT_RECEIVED on confirm", "Then open GRN for the Gate Entry"],
  },
  quiz: [
    { question: "GRN can start when…", choices: ["Gate Entry is created", "Boxes are Confirmed received", "PO is selected", "Putaway finishes"], answer: 1, explain: "Confirm sets INWARD_BOX_RECEIVED." },
    { question: "Use External Box Codes when…", choices: ["WMS must print stickers", "Boxes already have partner codes", "Always", "Only for putaway"], answer: 1, explain: "Scan existing codes instead of printing." },
    { question: "Internal print batch max is…", choices: ["50", "100", "500", "Unlimited"], answer: 2, explain: "Max. Limit: 500 per batch." },
  ],
  steps: [
    { element: "#receive-external-toggle", title: "External box codes", description: "Keep <strong>OFF</strong> to let WMS generate and print inward box stickers.", practicePrompt: "Leave toggle off", expected: { type: "action" }, skillLabel: "Mode", skillIndex: 1 },
    { element: "#receive-gate-entry-id", title: "Gate Entry ID", description: "Enter the Gate Entry you just submitted. Example: <strong>GE-10042</strong>", practicePrompt: "GE-10042", required: true, expected: { type: "input", selector: "#receive-gate-entry-id", value: "GE-10042" }, skillLabel: "Identify", skillIndex: 2 },
    { element: "#receive-no-boxes", title: "No. of Boxes", description: "Physical boxes received. Max <strong>500</strong> per print batch. Example: <strong>3</strong>", practicePrompt: "3", required: true, expected: { type: "input", selector: "#receive-no-boxes", value: "3" }, skillLabel: "Count", skillIndex: 2 },
    { element: "#receive-btn-print", title: "Print Boxes", description: "WMS creates inward box IDs and prints stickers. Paste each on a physical box.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("receive-btn-print")?.click(); }, skillLabel: "Print", skillIndex: 3 },
    { element: "#receive-boxes-table", title: "Review box list", description: "Check generated box codes and RECEIVED status before confirming.", expected: { type: "action" }, side: "top", skillLabel: "Review", skillIndex: 3 },
    { element: "#receive-btn-confirm", title: "Confirm", description: "Marks all inward boxes received. Gate Entry → <strong>INWARD_BOX_RECEIVED</strong>. Then start GRN.", expected: { type: "action" }, onWatchFill: () => { document.getElementById("receive-btn-confirm")?.click(); }, skillLabel: "Confirm", skillIndex: 4 },
  ],
};
