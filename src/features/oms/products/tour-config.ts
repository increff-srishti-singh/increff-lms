import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("oms-product")!;

/** Reveal a tab's CSV field list without toggling it shut if it is already open. */
function openFields(tabId: string) {
  const panel = document.getElementById(`prod-${tabId}-fields-panel`);
  if (panel?.classList.contains("hidden")) {
    document.getElementById(`prod-${tabId}-btn-fields`)?.click();
  }
}

export const ProductsTour: TourConfig = {
  moduleId: "oms-product",
  pageKey: "oms-product",
  pageHref: "/oms/products",
  parentModuleName: "Products",
  track: "OMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: [
    "Product / SKU",
    "SKU Code",
    "Bundled SKU",
    "UOM (Unit of Measure)",
    "Perishable SKU",
    "Client",
  ],
  pitfalls: [
    "Creating an inward PO for a SKU that was never added to product master",
    "Marking a SKU both Bundled and UOM — the notes are explicit this is not allowed",
    "Editing structural flags (isBundled / isUom) after the SKU is already live",
    "Uploading a bundle or UOM definition CSV before the child SKUs exist",
    "Assuming Mark as Perishable works for any client — it needs the Expiry feature enabled",
  ],
  scenarios: [
    {
      id: "product",
      title: "Product",
      story:
        "ABC Fashion is going live with its SKU catalogue. Walk every Products tab — create SKUs, understand edits, enable perishable tracking, and define a bundle and a UOM breakdown.",
    },
  ],
  summary: {
    title: "Products — complete",
    intro:
      "You walked the SKU master screen — creating SKUs, editing them, and defining perishable, bundled and UOM behaviour.",
    takeaways: [
      "Product master is the ID card for every item OMS/WMS handles — nothing else works without it",
      "New and Edit both move in bulk via CSV; there is no one-by-one entry screen",
      "A Bundled SKU has no stock of its own — its sellable quantity is capped by the scarcest child",
      "UOM defines how one larger unit breaks into smaller ones, e.g. Case → Box → Each",
    ],
    recap: [
      "Mark as Perishable only works for clients with the Expiry feature enabled",
      "A SKU cannot be both Bundled and UOM",
      "GRN and picking always happen on the child SKU, never the bundle or the UOM parent",
      "Bundled SKU Definition and UOM Definition rows both need their child SKUs to already exist",
    ],
  },
  quiz: [
    {
      question: "Which of these can you NOT do on the Products screen?",
      choices: [
        "Bulk-create SKUs via CSV",
        "Bulk-edit SKUs via CSV",
        "Add one SKU by filling a form",
        "Define a bundled SKU via CSV",
      ],
      answer: 2,
      explain: "Every tab here is CSV-driven — there is no single-SKU manual entry form.",
    },
    {
      question: "Combo SKU has 1 Shampoo + 1 Conditioner. Stock: Shampoo = 8, Conditioner = 5. How many combos can OMS sell?",
      choices: ["8", "5", "13", "0, bundles have no stock"],
      answer: 1,
      explain: "A bundle's sellable quantity is capped by its scarcest child — 5, limited by Conditioner.",
    },
    {
      question: "1 Case = 5 Boxes, 1 Box = 10 Each. This relationship is defined using…",
      choices: ["Bundled SKU Definition", "UOM Definition", "Mark SKUs as Perishable", "Pack Box Master"],
      answer: 1,
      explain: "UOM Definition sets how a larger unit breaks into the next smaller one.",
    },
    {
      question: "Mark SKUs as Perishable will not work for a client unless…",
      choices: [
        "The SKU has an image",
        "The client has the Expiry feature enabled",
        "The SKU is also Bundled",
        "Attributes are filled in",
      ],
      answer: 1,
      explain: "The feature is gated — it only applies to clients with Expiry enabled.",
    },
    {
      question: "A SKU can be marked as…",
      choices: [
        "Both Bundled and UOM at once",
        "Bundled or UOM, but not both",
        "Neither, every SKU must pick one",
        "UOM only if it is also Perishable",
      ],
      answer: 1,
      explain: "The notes are explicit: a SKU cannot be both Bundled and UOM.",
    },
  ],
  steps: [
    {
      element: "#prod-tabs",
      title: "Products",
      description:
        "Products is the <strong>SKU master</strong> screen — the ID card for every item the client receives, stores, picks, packs, and ships. Nothing else in OMS or WMS works until a SKU exists here. Every tab moves data in bulk via CSV; there is no one-by-one add form.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
      },
      side: "bottom",
      skillLabel: "New",
      skillIndex: 1,
    },
    {
      element: "#prod-new-panel",
      title: "New",
      description:
        "Creates fresh SKUs. The CSV covers identity (code, barcode, brand, style), pricing and tax, images, physical dimensions, custom attributes, and the perishable / bundled / UOM flags — all in one file.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
      },
      side: "right",
      skillLabel: "New",
      skillIndex: 1,
    },
    {
      element: "#prod-new-file",
      title: "Choose file",
      description: "Use <strong>Browse</strong> to pick the filled-in SKU master CSV.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
      },
      onWatchFill: () => {
        document.getElementById("prod-new-browse")?.click();
      },
      side: "bottom",
      skillLabel: "New",
      skillIndex: 1,
    },
    {
      element: "#prod-new-note",
      title: "Empty vs. null",
      description:
        "A blank cell leaves the existing value alone; an explicit <strong>null</strong> clears it. That distinction matters more here than on create, since the same template is reused for updates.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
      },
      commonMistakes: "Sending null to \"clear\" a field on create, when the SKU never had a value to begin with — harmless, but worth understanding before it is used on Edit.",
      side: "bottom",
      skillLabel: "New",
      skillIndex: 1,
    },
    {
      element: "#prod-new-limit",
      title: "Row limit & template",
      description:
        "Up to <strong>15,000 rows</strong> per upload. Always start from <strong>Download Template</strong>, and use the <strong>i</strong> icon to see what every column means.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
        openFields("new");
      },
      side: "bottom",
      skillLabel: "New",
      skillIndex: 1,
    },
    {
      element: "#prod-new-fields-panel",
      title: "The 30 CSV fields",
      description:
        "<strong>clientSkuId</strong>, <strong>barcode</strong>, <strong>brandId</strong>, <strong>name</strong>, <strong>styleId</strong>, <strong>category</strong>, <strong>mrp</strong> and <strong>taxPercent</strong> are mandatory. The three flags — <strong>isBundled</strong>, <strong>isSerialCodeRequired</strong>, <strong>isUom</strong> — decide which of the other Products tabs this SKU can appear in.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
        openFields("new");
      },
      commonMistakes: "Setting isBundled and isUom both TRUE on the same row — the notes are explicit a SKU cannot be both.",
      side: "top",
      skillLabel: "New",
      skillIndex: 1,
    },
    {
      element: "#prod-new-submit",
      title: "Submit",
      description: "Uploads the file. New SKUs appear in product master once processing finishes.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-new")?.click();
      },
      onWatchFill: () => {
        document.getElementById("prod-new-submit")?.click();
      },
      switchTabOnNext: "#tab-edit",
      side: "top",
      skillLabel: "New",
      skillIndex: 1,
    },

    {
      element: "#prod-edit-panel",
      title: "Edit",
      description:
        "Updates SKUs that already exist. Only <strong>clientSkuId</strong> is mandatory here — every other column is an optional override, so you only need to include the fields you are actually changing.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-edit")?.click();
      },
      side: "right",
      skillLabel: "Edit",
      skillIndex: 2,
    },
    {
      element: "#prod-edit-note",
      title: "Partial updates",
      description:
        "Leave a column blank to keep the SKU's current value. This is why the empty-vs-null distinction from the New tab matters — Edit is where you actually use it.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-edit")?.click();
      },
      side: "bottom",
      skillLabel: "Edit",
      skillIndex: 2,
    },
    {
      element: "#prod-edit-submit",
      title: "Submit",
      description: "Uploads the update file. Changed SKUs reflect once processing finishes.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-edit")?.click();
      },
      onWatchFill: () => {
        document.getElementById("prod-edit-submit")?.click();
      },
      switchTabOnNext: "#tab-perishable",
      side: "top",
      skillLabel: "Edit",
      skillIndex: 2,
    },

    {
      element: "#prod-perishable-panel",
      title: "Mark SKUs as Perishable",
      description:
        "Switches on batch and expiry tracking for the SKUs listed — food, cosmetics, medicine, anything with a shelf life. Just one column: the SKU code.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-perishable")?.click();
      },
      side: "right",
      skillLabel: "Perishable",
      skillIndex: 3,
    },
    {
      element: "#prod-perishable-note",
      title: "Expiry feature required",
      description:
        "This only works for clients that have the <strong>Expiry feature</strong> enabled. Uploading it for a client without that feature will not do anything.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-perishable")?.click();
      },
      commonMistakes: "Assuming this tab works for every client — it is gated behind a feature flag.",
      side: "bottom",
      skillLabel: "Perishable",
      skillIndex: 3,
    },
    {
      element: "#prod-perishable-submit",
      title: "Submit",
      description: "Uploads the file. Listed SKUs start batch/expiry tracking on the next GRN.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-perishable")?.click();
      },
      onWatchFill: () => {
        document.getElementById("prod-perishable-submit")?.click();
      },
      switchTabOnNext: "#tab-bundled",
      side: "top",
      skillLabel: "Perishable",
      skillIndex: 3,
    },

    {
      element: "#prod-bundled-panel",
      title: "Bundled SKU Definition",
      description:
        "A <strong>bundled SKU</strong> is a virtual combo with no stock of its own — its sellable quantity is capped by whichever child SKU is scarcest. If a combo has 1 Shampoo + 1 Conditioner, and Shampoo = 8 but Conditioner = 5, OMS can only sell 5 combos.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-bundled")?.click();
      },
      side: "right",
      skillLabel: "Bundled",
      skillIndex: 4,
    },
    {
      element: "#prod-bundled-limit",
      title: "Row limit & fields",
      description:
        "Up to <strong>5,000 rows</strong>. Each row links one <strong>bundledParentClientSkuId</strong> to one <strong>childClientSkuId</strong> with a <strong>qty</strong> — a multi-item bundle needs one row per child.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-bundled")?.click();
        openFields("bundled");
      },
      commonMistakes: "Uploading a bundle definition before its child SKUs exist in product master — the row is rejected.",
      side: "bottom",
      skillLabel: "Bundled",
      skillIndex: 4,
    },
    {
      element: "#prod-bundled-submit",
      title: "Submit",
      description:
        "Uploads the file. GRN and picking still happen on the child SKUs — the parent combo is never physically scanned.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-bundled")?.click();
      },
      onWatchFill: () => {
        document.getElementById("prod-bundled-submit")?.click();
      },
      switchTabOnNext: "#tab-uom",
      side: "top",
      skillLabel: "Bundled",
      skillIndex: 4,
    },

    {
      element: "#prod-uom-panel",
      title: "UOM Definition",
      description:
        "<strong>UOM</strong> — Unit of Measure — defines how a bigger packing unit breaks into a smaller one: 1 Case → 5 Boxes, 1 Box → 10 Each. Unlike a bundle, a UOM SKU is real physical stock, just at a different pack size.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-uom")?.click();
      },
      side: "right",
      skillLabel: "UOM",
      skillIndex: 5,
    },
    {
      element: "#prod-uom-limit",
      title: "Row limit & fields",
      description:
        "Up to <strong>5,000 rows</strong>. Each row states the UOM SKU and the next SKU it breaks into, plus the quantity — chain several rows together for Case → Box → Each.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-uom")?.click();
        openFields("uom");
      },
      commonMistakes: "Marking a SKU both isUom and isBundled on the New tab — not allowed. Also avoid mixing perishable and non-perishable SKUs in the same UOM chain.",
      side: "bottom",
      skillLabel: "UOM",
      skillIndex: 5,
    },
    {
      element: "#prod-uom-submit",
      title: "Submit",
      description:
        "Uploads the file. Once processed, this UOM definition usually cannot be edited — double-check it before submitting.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-uom")?.click();
      },
      onWatchFill: () => {
        document.getElementById("prod-uom-submit")?.click();
      },
      side: "top",
      skillLabel: "UOM",
      skillIndex: 5,
    },
  ],
};
