import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";
import { fillInput } from "@/shared/lib/tour-utils";

const HOME = "/";
const mod = getModule("oms-partner-location")!;

/** Reveal the CSV field list without toggling it shut if it is already open. */
function openCsvFields() {
  const panel = document.getElementById("pl-fields-panel");
  if (panel?.classList.contains("hidden")) {
    document.getElementById("pl-btn-fields")?.click();
  }
}

export const PartnerLocationsTour: TourConfig = {
  moduleId: "oms-partner-location",
  pageKey: "oms-partner-location",
  pageHref: "/oms/partner-locations",
  parentModuleName: "Partner Locations",
  track: "OMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: [
    "Partner Location",
    "Fulfillment Location",
    "Partner Code",
    "Partner Location Code",
    "Location Code",
    "GSTIN",
    "Supplier",
    "Customer",
    "Client",
  ],
  pitfalls: [
    "Confusing a partner location (external party) with a fulfillment location (client's own site)",
    "Creating the supplier but never creating its factory address, so inward orders cannot be raised",
    "Wrong GSTIN on the billing address — invoices then post incorrectly",
    "Picking the wrong branch when a partner has several, sending stock to the wrong door",
    "Leaving billing on form-filled and half-completing it, when it should mirror shipping",
  ],
  scenarios: [
    {
      id: "add-one",
      title: "Add one partner location",
      story:
        "XYZ Garments exists as a supplier but has no address on file, so inward orders cannot be raised. Add its Tirupur factory as a partner location.",
    },
    {
      id: "bulk",
      title: "Bulk upload partner locations",
      story:
        "RetailMart is opening 60 stores. Load every delivery address in one CSV instead of adding them one at a time.",
    },
  ],
  summary: {
    title: "Partner Locations — complete",
    intro:
      "You registered the exact address a partner ships from or receives at — the other end of every inward and outward movement.",
    takeaways: [
      "Partner location = the external party's address; fulfillment location = the client's own site",
      "Inward: supplier partner location → client fulfillment location",
      "Outward: client fulfillment location → customer partner location",
      "One partner can have many locations — each factory, store or DC is its own record",
    ],
    recap: [
      "Partner Code = who they are; Partner Location Code = where they are; Location Code = the client's own site",
      "GSTIN sits on the location, not the partner — tick NA when it genuinely has none",
      "Billing can mirror the shipping or supplier address instead of being retyped",
      "Bulk CSV takes 3000 rows with a shipping block and a billing block per row",
    ],
  },
  quiz: [
    {
      question: "Which of these is a partner location?",
      choices: [
        "The client's Bangalore warehouse",
        "XYZ Garments' Tirupur factory",
        "The client's Mumbai store",
        "The WMS instance",
      ],
      answer: 1,
      explain:
        "Partner locations belong to external parties. The client's own warehouse or store is a fulfillment location.",
    },
    {
      question: "In an inward order, the partner location is…",
      choices: [
        "The supplier address goods come from",
        "The customer address goods go to",
        "The client's receiving warehouse",
        "The transporter hub",
      ],
      answer: 0,
      explain: "Inward runs supplier partner location → client fulfillment location.",
    },
    {
      question: "Goods ship from the client's Bangalore warehouse to RetailMart's Pune store. Partner Location Code is…",
      choices: ["Bangalore warehouse", "RetailMart", "RetailMart Pune Store", "The client"],
      answer: 2,
      explain:
        "Partner Code is RetailMart, Partner Location Code is the Pune store, and Location Code is the client's Bangalore warehouse.",
    },
    {
      question: "A supplier has three factories. How many partner locations?",
      choices: ["One, the supplier", "Three, one per factory", "One per client", "None, addresses live on the supplier"],
      answer: 1,
      explain: "Each dispatch address is its own partner location so orders can name the exact source.",
    },
    {
      question: "Billing set to \"Use Shipping Address\" means…",
      choices: [
        "The billing block is copied from the shipping block",
        "Billing is skipped entirely",
        "The supplier is billed directly",
        "GSTIN becomes optional",
      ],
      answer: 0,
      explain: "It reuses the shipping address so you do not retype it, and the billing fields go read-only.",
    },
  ],
  steps: [
    {
      element: "#pl-search-tabs",
      title: "Partner Locations",
      description:
        "A <strong>partner location</strong> is the exact address of an external party — a supplier's factory or a customer's store. The client's own warehouses are <strong>fulfillment locations</strong>, a different screen. Search here by partner, or directly by Location ID.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#pl-partner-type",
      title: "Partner Type",
      description:
        "<strong>Supplier</strong> locations are sources — goods come from them on inward orders. <strong>Customer</strong> locations are destinations — goods go to them on outward orders. Pick <strong>Supplier</strong>.",
      practicePrompt: "Supplier",
      required: true,
      expected: { type: "select", selector: "#pl-partner-type", value: "Supplier" },
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#pl-partner",
      title: "Partner",
      description:
        "The dropdown re-labels to match the type. Choose <strong>XYZ Garments</strong> to see the addresses already on file for it.",
      practicePrompt: "XYZ Garments",
      expected: { type: "select", selector: "#pl-partner", value: "xyz-garments" },
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#pl-btn-search",
      title: "Search",
      description: "Runs the query. <strong>No Data to Show</strong> means this partner has no address yet — so orders naming it would fail.",
      expected: { type: "action" },
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#pl-results-table",
      title: "The directory",
      description:
        "Each row is one address, with <strong>GSTIN</strong> and separate <strong>shipping</strong> and <strong>billing</strong> details — goods and invoices do not always go to the same place.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Search",
      skillIndex: 2,
    },
    {
      element: "#pl-btn-add",
      title: "Add Location",
      description: "Opens the create dialog. Click <strong>Next</strong> to continue inside it.",
      expected: { type: "action" },
      openModalOnNext: "modal-add-partner-location",
      skillLabel: "Create",
      skillIndex: 2,
    },

    // ---- Scenario split ----
    {
      element: "#modal-add-pl-tabs",
      title: "Two ways in",
      description:
        "<strong>Add New Location</strong> creates one address by hand. <strong>Bulk Upload</strong> takes a CSV. We are adding a single factory, so stay on the form.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Create",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#modal-add-pl-tabs",
      title: "Two ways in",
      description: "60 store addresses one at a time is not realistic — switch to <strong>Bulk Upload</strong>.",
      expected: { type: "action" },
      switchTabOnNext: "#tab-bulk-location",
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 2,
      scenarioIds: ["bulk"],
    },

    // ---- Single partner location ----
    {
      element: "#field-pl-supplier",
      title: "Supplier *",
      description:
        "Required. Which partner this address belongs to — the <strong>Partner Code</strong>. The address you are about to enter becomes its <strong>Partner Location Code</strong>. Pick <strong>XYZ Garments</strong>.",
      practicePrompt: "XYZ Garments",
      required: true,
      expected: { type: "select", selector: "#pl-supplier", value: "xyz-garments" },
      side: "right",
      skillLabel: "Create",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-pl-gstin",
      title: "GSTIN No. *",
      description:
        "Required. The tax registration for <em>this address</em>, not the partner as a whole — a supplier with factories in two states has a different GSTIN for each. Example: <strong>33AABCX1234F1Z5</strong>",
      practicePrompt: "33AABCX1234F1Z5",
      required: true,
      commonMistakes: "Reusing the head-office GSTIN for every branch — invoices then post to the wrong state.",
      expected: { type: "input", selector: "#pl-gstin", value: "33AABCX1234F1Z5" },
      side: "bottom",
      skillLabel: "Create",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-pl-gstin-na",
      title: "NA",
      description:
        "Tick this only when the location genuinely has no GST registration — it greys out the GSTIN box. Leave it clear here.",
      expected: { type: "action" },
      side: "left",
      skillLabel: "Create",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-pl-expose",
      title: "Expose Location Inventory on Channels",
      description:
        "Makes stock held at this partner location sellable on the client's sales channels — the vendor-inventory case. Leave it off for a plain supplier factory.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Create",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-contact-name",
      title: "Shipping — Contact Name *",
      description:
        "Required. Who to call at the dispatch point. Example: <strong>Ravi Menon</strong>",
      practicePrompt: "Ravi Menon",
      required: true,
      expected: { type: "input", selector: "#pl-ship-contact-name", value: "Ravi Menon" },
      side: "right",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-contact-more",
      title: "Shipping — Email / Number",
      description: "Both optional. Used for pickup coordination.",
      practicePrompt: "ravi@xyzgarments.in",
      expected: { type: "input", selector: "#pl-ship-email", value: "ravi@xyzgarments.in" },
      onWatchFill: () => fillInput("#pl-ship-phone", "+91-9845012345"),
      side: "left",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-address1",
      title: "Shipping — Address Line 1 *",
      description:
        "Required. This is the address goods physically leave from. Example: <strong>Unit 7, Textile Park</strong>",
      practicePrompt: "Unit 7, Textile Park",
      required: true,
      expected: { type: "input", selector: "#pl-ship-address1", value: "Unit 7, Textile Park" },
      side: "right",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-address-more",
      title: "Shipping — Address Line 2 / Area",
      description: "Both optional. Example area: <strong>Tirupur</strong>",
      practicePrompt: "Tirupur",
      expected: { type: "input", selector: "#pl-ship-area", value: "Tirupur" },
      side: "left",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-city",
      title: "Shipping — City *",
      description: "Required. Example: <strong>Tirupur</strong>",
      practicePrompt: "Tirupur",
      required: true,
      expected: { type: "input", selector: "#pl-ship-city", value: "Tirupur" },
      side: "right",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-pincode",
      title: "Shipping — Pincode *",
      description: "Required. Example: <strong>641604</strong>",
      practicePrompt: "641604",
      required: true,
      expected: { type: "input", selector: "#pl-ship-pincode", value: "641604" },
      side: "top",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-country",
      title: "Shipping — Country *",
      description: "Required, and pick it before State. Example: <strong>India</strong>",
      practicePrompt: "India",
      required: true,
      expected: { type: "select", selector: "#pl-ship-country", value: "IN" },
      side: "left",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-ship-state",
      title: "Shipping — State *",
      description:
        "Required, and it must agree with the GSTIN — the first two digits of a GSTIN encode the state. Example: <strong>Tamil Nadu</strong>",
      practicePrompt: "Tamil Nadu",
      required: true,
      expected: { type: "select", selector: "#pl-ship-state", value: "TN" },
      side: "right",
      skillLabel: "Shipping",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-pl-billing-mode",
      title: "Billing Address",
      description:
        "Invoices do not always go where goods go. <strong>Use below form-filled</strong> types a separate address, <strong>Use Shipping Address</strong> copies what you just entered, <strong>Use Supplier Address</strong> uses the supplier's own registered address. The factory bills from the same site — pick <strong>Use Shipping Address</strong>.",
      practicePrompt: "Use Shipping Address",
      required: true,
      expected: { type: "radio", name: "pl-billing-mode", value: "shipping" },
      side: "bottom",
      skillLabel: "Billing",
      skillIndex: 4,
      scenarioIds: ["add-one"],
    },
    {
      element: "#pl-billing-fields",
      title: "Billing fields",
      description:
        "Now read-only, because billing is mirroring the shipping address. Switch back to <strong>Use below form-filled</strong> only when the partner invoices from a different office.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Billing",
      skillIndex: 4,
      scenarioIds: ["add-one"],
    },
    {
      element: "#modal-add-pl-actions",
      title: "Submit",
      description:
        "Creates the location and issues its Location ID. XYZ Garments can now be used as the source on an inward order.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("pl-btn-submit")?.click();
      },
      side: "top",
      skillLabel: "Billing",
      skillIndex: 4,
      scenarioIds: ["add-one"],
    },

    // ---- Bulk upload ----
    {
      element: "#field-pl-bulk-supplier",
      title: "One supplier, or many",
      description:
        "Either pick a single supplier and upload only its addresses, <strong>or</strong> tick <strong>Upload Locations for multiple Suppliers in CSV</strong> — which greys the dropdown, because the file then names the partner on every row.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 2,
      scenarioIds: ["bulk"],
    },
    {
      element: "#pl-bulk-file",
      title: "Choose file",
      description: "Use <strong>Browse</strong> to pick the filled-in CSV. Up to <strong>3000 rows</strong> per upload.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("pl-btn-browse")?.click();
      },
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 3,
      scenarioIds: ["bulk"],
    },
    {
      element: "#pl-bulk-limit",
      title: "Template & field list",
      description:
        "Always start from <strong>Download Template</strong>. The <strong>i</strong> icon explains every column — worth reading before the first upload.",
      expected: { type: "action" },
      onEnter: openCsvFields,
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 3,
      scenarioIds: ["bulk"],
    },
    {
      element: "#pl-fields-panel",
      title: "The 21 CSV fields",
      description:
        "One <strong>gstin</strong> column, then a full <strong>shipping</strong> block and a full <strong>billing</strong> block. Street lines 2 and 3 and the contact email and phone are optional; everything else is mandatory.",
      expected: { type: "action" },
      onEnter: openCsvFields,
      commonMistakes: "Filling only the shipping block — billing columns are mandatory too in the CSV.",
      side: "top",
      skillLabel: "Bulk",
      skillIndex: 4,
      scenarioIds: ["bulk"],
    },
    {
      element: "#modal-bulk-pl-actions",
      title: "Upload",
      description:
        "Submits the file. Rejected rows come back with a reason — a bad GSTIN or a missing mandatory column are the usual causes.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("pl-btn-upload")?.click();
      },
      side: "top",
      skillLabel: "Bulk",
      skillIndex: 4,
      scenarioIds: ["bulk"],
    },
  ],
};
