import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("oms-product")!;

function clickStandardEdit(key: string) {
  document.getElementById(`attr-edit-${key}`)?.click();
}

function clickCustomEdit() {
  document.querySelector<HTMLButtonElement>("#attr-custom-table tbody tr:last-child button:first-of-type")?.click();
}

export const AttributesConfigTour: TourConfig = {
  moduleId: "oms-product",
  pageKey: "oms-product-attributes",
  pageHref: "/oms/attributes-configuration",
  parentModuleName: "Attributes Configuration",
  learningModuleTitle: "Products",
  learningModuleHref: "/oms/products",
  learningPageKey: "oms-product",
  track: "OMS",
  number: mod.number,
  title: "Attributes Configuration",
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: [
    "Standard SKU Attribute",
    "Custom SKU Attribute",
    "Displayable Attribute",
    "Highlighted Attribute",
    "Searchable Attribute",
    "Client",
  ],
  pitfalls: [
    "Trying to highlight an attribute that isn't displayed — highlight always requires display first",
    "Assuming Length, Breadth and Height toggle independently — they move as one group",
    "Expecting to make Attribute8 searchable — only Attribute1–Attribute5 ever can",
    "Deleting a searchable custom attribute without removing its searchable flag first",
    "Forgetting values still come from the Products screen — this screen only defines the keys",
  ],
  scenarios: [
    {
      id: "attributes",
      title: "Configure Attributes",
      story:
        "ABC Fashion wants Fabric and Fragile visible to warehouse staff on every SKU. Check what's already displayed, then add the new custom fields.",
    },
  ],
  summary: {
    title: "Attributes Configuration — complete",
    intro:
      "You reviewed standard SKU attributes and added custom ones, controlling what warehouse staff actually see.",
    takeaways: [
      "Standard attributes are the client's default SKU fields; custom ones are extra, client-defined slots (up to 15)",
      "Displayable has a cap of 10 — but Length, Breadth and Height share their own separate headroom",
      "Highlighted has a cap of 2, and only applies to attributes that are already displayed",
      "Only Attribute1–Attribute5 can ever be searchable during GRN — a fixed rule, not a count you can raise",
    ],
    recap: [
      "This screen defines keys and display rules only — actual values are set via the Products screen's SKU upload",
      "A locked row (no pencil) is a system field the client cannot reconfigure",
      "A searchable custom attribute cannot be deleted until searchable is turned off",
      "Length/Breadth/Height move together — toggle one, the other two follow",
    ],
  },
  quiz: [
    {
      question: "A client can configure at most how many custom SKU attributes?",
      choices: ["5", "10", "15", "Unlimited"],
      answer: 2,
      explain: "Custom SKU attributes are capped at 15, keyed Attribute1 through Attribute15.",
    },
    {
      question: "Height is already displayed and highlighted. What happens to Breadth and Length?",
      choices: [
        "Nothing, they are independent",
        "They also become displayed and highlighted",
        "They become locked",
        "They are deleted",
      ],
      answer: 1,
      explain: "Length, Breadth and Height are handled as one group — they move together.",
    },
    {
      question: "Can Attribute9 be made searchable during GRN?",
      choices: [
        "Yes, if fewer than 5 are currently searchable",
        "No — only Attribute1 through Attribute5 can ever be searchable",
        "Yes, but only if it is highlighted",
        "Only for perishable SKUs",
      ],
      answer: 1,
      explain: "The first-five rule is structural, tied to the key itself, not a count you can free up.",
    },
    {
      question: "Where do you actually set an attribute's value for a specific SKU?",
      choices: [
        "On this Attributes Configuration screen",
        "Through the Products screen's SKU upload/edit",
        "It is set automatically",
        "Through the Suppliers screen",
      ],
      answer: 1,
      explain: "This screen only defines the attribute key and its display rules; values come from the SKU master upload.",
    },
    {
      question: "An attribute is displayed but not highlighted. To highlight it, you must first…",
      choices: [
        "Nothing — highlight works on any attribute",
        "Make sure it is already displayed, which it is",
        "Delete and recreate it",
        "Mark it searchable first",
      ],
      answer: 1,
      explain: "Displayed is already satisfied here — highlighting only ever requires that one condition.",
    },
  ],
  steps: [
    {
      element: "#attr-tabs",
      title: "Attributes Configuration",
      description:
        "Configured <strong>per client</strong>. <strong>Standard</strong> attributes are the default SKU fields every client gets; <strong>Custom</strong> attributes are extra fields the client defines — up to 15 of them.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-standard")?.click();
      },
      side: "bottom",
      skillLabel: "Standard",
      skillIndex: 1,
    },
    {
      element: "#attr-standard-caps",
      title: "The three caps",
      description:
        "<strong>Displayable</strong>: max 10 normal attributes at once. <strong>Highlighted</strong>: max 2, and only for attributes already displayed. <strong>Searchable</strong> (custom only): just Attribute1–5, always — not a count you can free up.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-standard")?.click();
      },
      side: "bottom",
      skillLabel: "Standard",
      skillIndex: 1,
    },
    {
      element: "#attr-row-brand",
      title: "A normal attribute",
      description:
        "The green eye means <strong>Brand</strong> is currently displayed in WMS. The pencil means it's editable — this client can turn it off.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-standard")?.click();
      },
      side: "right",
      skillLabel: "Standard",
      skillIndex: 1,
    },
    {
      element: "#attr-row-category",
      title: "A locked attribute",
      description:
        "<strong>Category</strong> has no pencil — it's a system field this client cannot reconfigure, regardless of the display cap.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-standard")?.click();
      },
      side: "right",
      skillLabel: "Standard",
      skillIndex: 1,
    },
    {
      element: "#attr-row-height",
      title: "A dimension attribute",
      description:
        "<strong>Height</strong> is part of the Length / Breadth / Height group — handled specially, with its own headroom separate from the normal 10-cap.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-standard")?.click();
      },
      side: "right",
      skillLabel: "Standard",
      skillIndex: 2,
    },
    {
      element: "#attr-edit-height",
      title: "Edit Height",
      description: "Click the pencil to open its display/highlight settings.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-standard")?.click();
      },
      onWatchFill: () => clickStandardEdit("height"),
      side: "right",
      skillLabel: "Standard",
      skillIndex: 2,
    },
    {
      element: "#field-attr-displayed-standard",
      title: "Display in WMS Master Data",
      description:
        "Because this is Height, toggling this also toggles Breadth and Length together — the note above the toggle explains the same.",
      expected: { type: "action" },
      onEnter: () => clickStandardEdit("height"),
      side: "left",
      skillLabel: "Standard",
      skillIndex: 2,
    },
    {
      element: "#field-attr-highlighted-standard",
      title: "Highlight in WMS Master Data",
      description:
        "Only enabled once displayed is TRUE. The dimension group counts as a single unit against the 2-highlight cap — not three.",
      expected: { type: "action" },
      onEnter: () => clickStandardEdit("height"),
      commonMistakes: "Expecting the dimension trio to consume all 2 highlight slots on its own — it only takes 1.",
      side: "left",
      skillLabel: "Standard",
      skillIndex: 2,
    },
    {
      element: "#modal-edit-attr-actions-standard",
      title: "Submit",
      description: "Saves the change — Length, Breadth and Height update together.",
      expected: { type: "action" },
      onEnter: () => clickStandardEdit("height"),
      onWatchFill: () => {
        document.getElementById("attr-btn-submit-edit-standard")?.click();
      },
      switchTabOnNext: "#tab-custom",
      side: "top",
      skillLabel: "Standard",
      skillIndex: 2,
    },
    {
      element: "#attr-btn-add-custom",
      title: "Add Custom Attribute",
      description: "Opens the create dialog. Click <strong>Next</strong> to continue inside it.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("tab-custom")?.click();
      },
      openModalOnNext: "modal-add-custom-attr",
      side: "bottom",
      skillLabel: "Custom",
      skillIndex: 3,
    },
    {
      element: "#field-attr-key",
      title: "Attribute Key",
      description:
        "Required. Pick the next free slot — <strong>Attribute1</strong>. Once used, a key drops out of this list for good.",
      practicePrompt: "Attribute1",
      required: true,
      expected: { type: "select", selector: "#new-attr-key", value: "Attribute1" },
      onEnter: () => {
        document.getElementById("modal-add-custom-attr")?.classList.add("open");
      },
      side: "right",
      skillLabel: "Custom",
      skillIndex: 3,
    },
    {
      element: "#field-attr-name",
      title: "Attribute Name",
      description:
        "Required. The label warehouse staff will actually see. Example: <strong>Fabric</strong>",
      practicePrompt: "Fabric",
      required: true,
      expected: { type: "input", selector: "#new-attr-name", value: "Fabric" },
      onEnter: () => {
        document.getElementById("modal-add-custom-attr")?.classList.add("open");
      },
      side: "left",
      skillLabel: "Custom",
      skillIndex: 3,
    },
    {
      element: "#modal-add-custom-actions",
      title: "Submit",
      description:
        "Creates the attribute. It's just a key and a label for now — no values yet, and not shown in WMS until configured.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("modal-add-custom-attr")?.classList.add("open");
      },
      onWatchFill: () => {
        document.getElementById("attr-btn-submit-custom")?.click();
      },
      side: "top",
      skillLabel: "Custom",
      skillIndex: 3,
    },
    {
      element: "#attr-custom-table",
      title: "The new attribute",
      description:
        "Fabric appears with a plain eye — not displayed yet — and Edit / Delete actions. Values for it still come from the <strong>Products</strong> screen's SKU upload, not from here.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Custom",
      skillIndex: 4,
    },
    {
      element: "#attr-custom-table tbody tr:last-child button:first-of-type",
      title: "Edit Fabric",
      description: "Click the pencil to set display, highlight, and — since this is Attribute1 — searchable too.",
      expected: { type: "action" },
      onWatchFill: () => clickCustomEdit(),
      side: "right",
      skillLabel: "Custom",
      skillIndex: 4,
    },
    {
      element: "#field-attr-displayed-custom",
      title: "Display in WMS Master Data",
      description: "Turn this on so Fabric actually shows up wherever SKU master data appears in WMS.",
      practicePrompt: "TRUE",
      required: true,
      expected: { type: "radio", name: "attr-displayed-custom", value: "TRUE" },
      onEnter: () => clickCustomEdit(),
      side: "left",
      skillLabel: "Custom",
      skillIndex: 4,
    },
    {
      element: "#field-attr-searchable-custom",
      title: "Use as Search Field During GRN",
      description:
        "Only visible at all because Fabric is Attribute1 — inside the first five. Attribute6 onward would never show this option.",
      expected: { type: "action" },
      onEnter: () => clickCustomEdit(),
      commonMistakes: "A searchable attribute cannot later be deleted until searchable is switched off first.",
      side: "left",
      skillLabel: "Custom",
      skillIndex: 4,
    },
    {
      element: "#modal-edit-attr-actions-custom",
      title: "Submit",
      description: "Saves Fabric's display rules. Warehouse staff will see it the next time SKU master data appears.",
      expected: { type: "action" },
      onEnter: () => clickCustomEdit(),
      onWatchFill: () => {
        document.getElementById("attr-btn-submit-edit-custom")?.click();
      },
      side: "top",
      skillLabel: "Custom",
      skillIndex: 4,
    },
  ],
};
