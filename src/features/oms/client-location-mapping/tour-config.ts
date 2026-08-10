import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";
import { fillInput } from "@/shared/lib/tour-utils";

const HOME = "/";
const mod = getModule("oms-client-mapping")!;

/** Reveal the CSV field list without toggling it shut if it is already open. */
function openCsvFields() {
  const panel = document.getElementById("clm-fields-panel");
  if (panel?.classList.contains("hidden")) {
    document.getElementById("clm-btn-fields")?.click();
  }
}

export const ClientLocationMappingTour: TourConfig = {
  moduleId: "oms-client-mapping",
  pageKey: "oms-client-mapping",
  pageHref: "/oms/client-location-mapping",
  parentModuleName: "Client Fulfillment Location Mapping",
  track: "OMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: [
    "Client Location Mapping",
    "Client",
    "Fulfillment Location",
    "GSTIN",
    "Location Type",
  ],
  pitfalls: [
    "Creating a fulfillment location and assuming a client can use it immediately",
    "Mapping the wrong location, so orders route to the wrong warehouse",
    "Leaving GSTIN blank when the location genuinely needs one",
    "CSV billingAddressType with a value other than Client, Location, or empty",
  ],
  scenarios: [
    {
      id: "add-one",
      title: "Add one mapping",
      story:
        "ABC Fashion just went live in a new Bengaluru warehouse, but the warehouse and the client both exist as separate records with no link. Map them so orders can actually use it.",
    },
    {
      id: "bulk",
      title: "Bulk upload mappings",
      story:
        "A rollout is enabling 50 client–warehouse pairs at once. Load them from a CSV instead of mapping each by hand.",
    },
  ],
  summary: {
    title: "Client Fulfillment Location Mapping — complete",
    intro:
      "You linked a client to a fulfillment location — the permission that lets OMS actually use that warehouse for the client.",
    takeaways: [
      "A location existing in OMS does not mean a client can use it — mapping is the permission",
      "Without mapping: no inventory visibility, no inward, no outward, no routing, no WMS tasks for that pair",
      "Client Billing Address can be typed fresh, or copied from the client or the location",
      "OMS only routes orders to locations mapped to that client, even if stock sits elsewhere",
    ],
    recap: [
      "Setup order: client → fulfillment location → mapping → suppliers can then be used against it",
      "CSV billingAddressType accepts Client, Location, or empty (uses the CSV's own address)",
      "Wrong mapping ≠ missing mapping — both break fulfillment, in different ways",
      "Up to 1000 rows per bulk upload",
    ],
  },
  quiz: [
    {
      question: "ABC Fashion has a Bengaluru warehouse in OMS, but it is not mapped to ABC Fashion. What happens?",
      choices: [
        "Orders route there anyway",
        "ABC Fashion cannot use it for inventory or orders",
        "The warehouse is deleted automatically",
        "It becomes a partner location",
      ],
      answer: 1,
      explain: "The location exists in the system but is invisible to that client until mapping links them.",
    },
    {
      question: "ABC Fashion has stock in Bangalore Warehouse and Mumbai Store, but only Bangalore is mapped. OMS will route orders to…",
      choices: ["Whichever is cheaper", "Only Bangalore Warehouse", "Only Mumbai Store", "Neither"],
      answer: 1,
      explain: "OMS only considers locations mapped to that client, even when unmapped locations hold stock.",
    },
    {
      question: "billingAddressType = Location in the CSV means…",
      choices: [
        "Billing uses the address typed in the CSV",
        "Billing copies the client's address",
        "Billing copies the fulfillment location's address",
        "The row is rejected",
      ],
      answer: 2,
      explain: "Location reuses the fulfillment location's own address as the billing address.",
    },
    {
      question: "Which of these is NOT needed before a supplier can ship into a warehouse?",
      choices: [
        "The client exists",
        "The fulfillment location exists",
        "The client is mapped to that location",
        "The supplier has a storefront",
      ],
      answer: 3,
      explain: "Client, location, and the mapping between them are the prerequisites. A storefront is irrelevant.",
    },
  ],
  steps: [
    {
      element: "#clm-filter-bar",
      title: "Client Fulfillment Location Mapping",
      description:
        "A fulfillment location can exist in OMS and still be unusable — a client can only use it once it is <strong>mapped</strong>. This screen creates that link.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#clm-location-type",
      title: "Location Type",
      description: "Optional filter. Example: <strong>Warehouse</strong>",
      practicePrompt: "Warehouse",
      expected: { type: "select", selector: "#clm-location-type", value: "WAREHOUSE" },
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#clm-btn-search",
      title: "Search",
      description: "Applies the filter.",
      expected: { type: "action" },
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#clm-results-table",
      title: "The directory",
      description:
        "Every row here is one client–location pair that is already usable. If ABC Fashion's new warehouse is not in this list, it cannot receive or ship anything yet.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Search",
      skillIndex: 1,
    },
    {
      element: "#clm-btn-add",
      title: "Add New Mapping",
      description: "Opens the create dialog. Click <strong>Next</strong> to continue inside it.",
      expected: { type: "action" },
      openModalOnNext: "modal-add-mapping",
      skillLabel: "Map",
      skillIndex: 2,
    },

    // ---- Scenario split ----
    {
      element: "#modal-add-mapping-tabs",
      title: "Two ways in",
      description:
        "<strong>Add New Mapping</strong> links one client to one location by hand. <strong>Bulk Upload</strong> takes a CSV. We are mapping a single warehouse, so stay on the form.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Map",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#modal-add-mapping-tabs",
      title: "Two ways in",
      description: "50 pairs one at a time is not realistic — switch to <strong>Bulk Upload</strong>.",
      expected: { type: "action" },
      switchTabOnNext: "#tab-bulk-mapping",
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 2,
      scenarioIds: ["bulk"],
    },

    // ---- Single mapping form ----
    {
      element: "#field-clm-client",
      title: "Client *",
      description: "Required. Which brand this mapping applies to. Pick <strong>ABC Fashion</strong>.",
      practicePrompt: "ABC Fashion",
      required: true,
      expected: { type: "select", selector: "#clm-client", value: "abc-fashion" },
      side: "right",
      skillLabel: "Map",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-clm-loc-type",
      title: "Location Type *",
      description:
        "Required, and it filters the Location dropdown next to it. This is a warehouse — keep <strong>Warehouse</strong>.",
      practicePrompt: "Warehouse",
      required: true,
      expected: { type: "radio", name: "clm-loc-type", value: "Warehouse" },
      side: "right",
      skillLabel: "Map",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-clm-location",
      title: "Location *",
      description:
        "Required. The fulfillment location to link — it must already exist. Pick <strong>Demo Central Warehouse</strong>.",
      practicePrompt: "Demo Central Warehouse",
      required: true,
      commonMistakes: "Mapping the wrong location — orders and inventory then land on the wrong warehouse.",
      expected: { type: "select", selector: "#clm-location", value: "demo-central-warehouse" },
      side: "left",
      skillLabel: "Map",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-clm-gstin",
      title: "GSTIN *",
      description:
        "Required. The tax registration for this client operating at this location. Example: <strong>29AAACA1234F1Z5</strong>",
      practicePrompt: "29AAACA1234F1Z5",
      required: true,
      expected: { type: "input", selector: "#clm-gstin", value: "29AAACA1234F1Z5" },
      side: "left",
      skillLabel: "Map",
      skillIndex: 2,
      scenarioIds: ["add-one"],
    },
    {
      element: "#field-clm-billing-mode",
      title: "Client Billing Address",
      description:
        "Where invoices for this client-location pair go. <strong>Use below form-filled</strong> types a fresh address, <strong>Use Client Address</strong> or <strong>Use Fulfillment Location Address</strong> reuse an existing one. Keep <strong>Use below form-filled</strong> and fill it in.",
      expected: { type: "action" },
      side: "bottom",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-contact-name",
      title: "Contact Name *",
      description: "Required. Example: <strong>Meera Nair</strong>",
      practicePrompt: "Meera Nair",
      required: true,
      expected: { type: "input", selector: "#clm-contact-name", value: "Meera Nair" },
      side: "right",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-contact-more",
      title: "Contact Email / Number",
      description: "Both optional.",
      practicePrompt: "meera@abcfashion.in",
      expected: { type: "input", selector: "#clm-contact-email", value: "meera@abcfashion.in" },
      onWatchFill: () => fillInput("#clm-contact-number", "+91-9812345678"),
      side: "left",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-address1",
      title: "Address Line 1 *",
      description: "Required. Example: <strong>Plot 42, Sector 12</strong>",
      practicePrompt: "Plot 42, Sector 12",
      required: true,
      expected: { type: "input", selector: "#clm-address1", value: "Plot 42, Sector 12" },
      side: "right",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-address-more",
      title: "Address Line 2 / Area",
      description: "Both optional. Example area: <strong>Whitefield</strong>",
      practicePrompt: "Whitefield",
      expected: { type: "input", selector: "#clm-area", value: "Whitefield" },
      side: "left",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-city",
      title: "City *",
      description: "Required. Example: <strong>Bengaluru</strong>",
      practicePrompt: "Bengaluru",
      required: true,
      expected: { type: "input", selector: "#clm-city", value: "Bengaluru" },
      side: "right",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-pincode",
      title: "Pincode *",
      description: "Required. Example: <strong>560066</strong>",
      practicePrompt: "560066",
      required: true,
      expected: { type: "input", selector: "#clm-pincode", value: "560066" },
      side: "top",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-country",
      title: "Country *",
      description: "Required, and pick it before State. Example: <strong>India</strong>",
      practicePrompt: "India",
      required: true,
      expected: { type: "select", selector: "#clm-country", value: "IN" },
      side: "left",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#clm-state",
      title: "State *",
      description: "Required. Example: <strong>Karnataka</strong>",
      practicePrompt: "Karnataka",
      required: true,
      expected: { type: "select", selector: "#clm-state", value: "KA" },
      side: "right",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },
    {
      element: "#modal-add-mapping-actions",
      title: "Submit",
      description:
        "Creates the mapping. ABC Fashion can now receive inventory, route orders, and get WMS tasks at this warehouse.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("clm-btn-submit")?.click();
      },
      side: "top",
      skillLabel: "Billing",
      skillIndex: 3,
      scenarioIds: ["add-one"],
    },

    // ---- Bulk upload ----
    {
      element: "#clm-bulk-file",
      title: "Upload Locations Mapping(s)",
      description: "One CSV maps many client–location pairs at once — the normal route for a multi-warehouse rollout.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("clm-btn-browse")?.click();
      },
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 2,
      scenarioIds: ["bulk"],
    },
    {
      element: "#clm-bulk-note",
      title: "billingAddressType",
      description:
        "This column controls where billing comes from: <strong>Client</strong> reuses the client's address, <strong>Location</strong> reuses the fulfillment location's address, and an <strong>empty value</strong> falls back to whatever address the CSV row itself gives.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Bulk",
      skillIndex: 3,
      scenarioIds: ["bulk"],
    },
    {
      element: "#clm-bulk-limit",
      title: "Row limit & template",
      description:
        "Up to <strong>1000 rows</strong> per upload. Always start from <strong>Download Template</strong>, and use the <strong>i</strong> icon to see what each column means.",
      expected: { type: "action" },
      onEnter: openCsvFields,
      side: "bottom",
      skillLabel: "Bulk",
      skillIndex: 3,
      scenarioIds: ["bulk"],
    },
    {
      element: "#clm-fields-panel",
      title: "The 14 CSV fields",
      description:
        "<strong>clientId</strong> and <strong>fulfillmentLocationId</strong> are the pair being mapped; <strong>gstin</strong> and <strong>billingAddressType</strong> are mandatory alongside them. Only email and phone, and address lines 2–3, are optional.",
      expected: { type: "action" },
      onEnter: openCsvFields,
      commonMistakes: "Getting clientId or fulfillmentLocationId wrong — the mapping then points at the wrong pair entirely.",
      side: "top",
      skillLabel: "Bulk",
      skillIndex: 3,
      scenarioIds: ["bulk"],
    },
    {
      element: "#modal-bulk-mapping-actions",
      title: "Upload",
      description:
        "Submits the file. Rejected rows come back with a reason — an unmapped client or location ID is the usual cause.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("clm-btn-upload")?.click();
      },
      side: "top",
      skillLabel: "Bulk",
      skillIndex: 3,
      scenarioIds: ["bulk"],
    },
  ],
};
