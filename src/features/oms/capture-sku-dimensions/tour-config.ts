import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("oms-product")!;

export const CaptureSkuDimensionsTour: TourConfig = {
  moduleId: "oms-product",
  pageKey: "oms-product-dimensions",
  pageHref: "/oms/capture-sku-dimensions",
  parentModuleName: "Capture SKU Dimensions",
  learningModuleTitle: "Products",
  learningModuleHref: "/oms/products",
  learningPageKey: "oms-product",
  track: "OMS",
  number: mod.number,
  title: "Capture SKU Dimensions",
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["SKU Dimensions", "Displayable Attribute", "Client"],
  pitfalls: [
    "Uploading only length and height via CSV, skipping breadth — the whole trio is required together or not at all",
    "Entering 0 or a negative number for a dimension — must be a decimal greater than 0",
    "Forgetting the Configurations panel controls which fields even appear on this screen",
    "Expecting a value here to show in WMS automatically — display still needs Attributes Configuration",
  ],
  scenarios: [
    {
      id: "capture-dimensions",
      title: "Capture SKU Dimension",
      story:
        "ABC Fashion needs SHIRT001's physical dimensions on file before it can be packed accurately. Scan the SKU, fill in its size, and save it.",
    },
  ],
  summary: {
    title: "Capture SKU Dimensions — complete",
    intro: "You captured length, breadth, height and weight for a SKU using its own dedicated screen.",
    takeaways: [
      "Two ways to capture dimensions: bulk via the Products CSV, or one SKU at a time here",
      "Length, breadth and height must be provided together or not at all — never just one or two",
      "Weight is independent of the other three and can be captured on its own",
      "Configurations decides which of the four fields even show up on this screen — all four by default",
    ],
    recap: [
      "Every value must be a decimal greater than 0",
      "Scanning a SKU that already has dimensions pre-fills the form for editing",
      "Configuration choices are saved in the browser (localStorage) and survive logout",
      "Capturing a value here doesn't show it in WMS — that still needs Attributes Configuration's display toggle",
    ],
  },
  quiz: [
    {
      question: "You capture Length and Height but leave Breadth blank. What happens on Submit?",
      choices: [
        "Saved with Breadth left empty",
        "Rejected — all three of length, breadth and height are required together, or none",
        "Breadth is set to 0 automatically",
        "Only Height is saved",
      ],
      answer: 1,
      explain: "Length, breadth and height are all-or-nothing — partial dimension sets are rejected.",
    },
    {
      question: "Can you capture just Weight without any of the three dimensions?",
      choices: ["No, weight always needs dimensions first", "Yes — weight is independent", "Only for perishable SKUs", "Only via the Products CSV"],
      answer: 1,
      explain: "Weight is configured and captured independently of length/breadth/height.",
    },
    {
      question: "What does the Configurations button control?",
      choices: [
        "Which client is active",
        "Which of length/breadth/height/weight appear as fields on this screen",
        "The SKU's price",
        "Whether the SKU is perishable",
      ],
      answer: 1,
      explain: "It toggles which dimension fields this screen captures — all four by default.",
    },
    {
      question: "After saving a dimension value here, where does it show up for warehouse staff?",
      choices: [
        "Automatically in WMS immediately",
        "Nowhere unless Attributes Configuration also marks it displayable",
        "Only in this screen's own report",
        "It emails the client",
      ],
      answer: 1,
      explain: "Capturing a value and displaying it in WMS are separate steps — display still runs through Attributes Configuration.",
    },
  ],
  steps: [
    {
      element: "#dim-sku-wrap",
      title: "Capture SKU Dimensions",
      description:
        "A second way to record a SKU's physical size, one SKU at a time — the alternative to bulk-uploading dimensions via the Products CSV. Pick the client, then scan or type the SKU.",
      practicePrompt: "Test11",
      expected: { type: "select", selector: "#dim-client", value: "test11" },
      side: "bottom",
      skillLabel: "Scan",
      skillIndex: 1,
    },
    {
      element: "#dim-sku-input",
      title: "Client SKU ID",
      description: "Scan or type the SKU code. Example: <strong>SHIRT001</strong>",
      practicePrompt: "SHIRT001",
      required: true,
      expected: { type: "input", selector: "#dim-sku-input", value: "SHIRT001" },
      onWatchFill: () => {
        const btn = document.getElementById("dim-sku-input") as HTMLInputElement | null;
        if (btn) btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      },
      side: "bottom",
      skillLabel: "Scan",
      skillIndex: 1,
    },
    {
      element: "#dim-sku-details",
      title: "SKU Details",
      description:
        "Confirms this is the right item before you measure it — description, brand, style, color, MRP. No image on file yet for this SKU.",
      expected: { type: "action" },
      side: "right",
      skillLabel: "Scan",
      skillIndex: 1,
    },
    {
      element: "#dim-btn-config",
      title: "Configurations",
      description:
        "Controls which of the four fields even appear below. All four — length, breadth, height, weight — are on by default. Saved to the browser, so it stays set after logout.",
      expected: { type: "action" },
      openModalOnNext: "modal-dim-config",
      side: "bottom",
      skillLabel: "Configure",
      skillIndex: 2,
    },
    {
      element: "#dim-cfg-weight-wrap",
      title: "Weight is independent",
      description:
        "Untick this and only length/breadth/height remain — weight can be captured on its own, or skipped on its own, unlike the dimension trio.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("modal-dim-config")?.classList.add("open");
      },
      side: "right",
      skillLabel: "Configure",
      skillIndex: 2,
    },
    {
      element: "#dim-cfg-save",
      title: "Save",
      description: "Keep all four checked for this run, then save.",
      expected: { type: "action" },
      onEnter: () => {
        document.getElementById("modal-dim-config")?.classList.add("open");
      },
      onWatchFill: () => {
        document.getElementById("dim-cfg-save")?.click();
      },
      side: "top",
      skillLabel: "Configure",
      skillIndex: 2,
    },
    {
      element: "#dim-length",
      title: "Length",
      description:
        "Cursor lands here automatically after a scan. Required alongside Breadth and Height — all three together, or none. Example: <strong>30</strong>",
      practicePrompt: "30",
      required: true,
      expected: { type: "input", selector: "#dim-length", value: "30" },
      side: "right",
      skillLabel: "Measure",
      skillIndex: 3,
    },
    {
      element: "#dim-breadth",
      title: "Breadth",
      description: "Example: <strong>20</strong>",
      practicePrompt: "20",
      required: true,
      commonMistakes: "Leaving this blank while Length and Height are filled — the whole trio is rejected together.",
      expected: { type: "input", selector: "#dim-breadth", value: "20" },
      side: "left",
      skillLabel: "Measure",
      skillIndex: 3,
    },
    {
      element: "#dim-height",
      title: "Height",
      description: "Example: <strong>2</strong>",
      practicePrompt: "2",
      required: true,
      expected: { type: "input", selector: "#dim-height", value: "2" },
      side: "right",
      skillLabel: "Measure",
      skillIndex: 3,
    },
    {
      element: "#dim-weight",
      title: "Weight",
      description:
        "Independent of the trio above — press <strong>Enter</strong> here or click Submit to save. Example: <strong>250</strong>",
      practicePrompt: "250",
      expected: { type: "input", selector: "#dim-weight", value: "250" },
      side: "left",
      skillLabel: "Measure",
      skillIndex: 3,
    },
    {
      element: "#dim-btn-submit",
      title: "Submit",
      description:
        "Saves the measurements. Scanning this SKU again later will show these same values pre-filled, ready to edit.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("dim-btn-submit")?.click();
      },
      side: "top",
      skillLabel: "Measure",
      skillIndex: 3,
    },
  ],
};
