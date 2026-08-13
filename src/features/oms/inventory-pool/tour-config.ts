import type { TourConfig } from "@/features/learning/types";
import { getModule } from "@/shared/lib/curriculum";

const HOME = "/";
const mod = getModule("oms-inventory")!;

export const InventoryPoolTour: TourConfig = {
  moduleId: "oms-inventory",
  pageKey: "oms-inventory",
  pageHref: "/oms/inventory-pool",
  parentModuleName: "Create Inventory Pool",
  track: "OMS",
  number: mod.number,
  title: mod.title,
  skills: mod.skills,
  homeHref: HOME,
  glossaryKeys: ["Inventory Pool", "Common Pool", "Reserved Pool", "Reservations", "Fulfillment Location"],
  pitfalls: [
    "Trying to create a second Common Pool for the same client and location — only one is ever allowed",
    "Forgetting a pool is scoped to one client and one fulfillment location, not shared across either",
    "Creating a pool without a plan for what goes in it — pools exist to segregate stock for a real business reason",
    "Expecting Submit here to move stock — this only creates the pool; moving stock in or out is a Reservations action",
  ],
  scenarios: [
    {
      id: "create-pool",
      title: "Create Inventory Pool",
      story:
        "ABC Fashion is launching on a marketplace and wants that stock kept separate from everyday orders. Create a Reserved pool for it at the Demo Central Warehouse.",
    },
  ],
  summary: {
    title: "Create Inventory Pool — complete",
    intro: "You created a Reserved inventory pool, segregating stock at a fulfillment location for a specific purpose.",
    takeaways: [
      "Physical stock lives in WMS; OMS splits it virtually into pools",
      "Every client-location pair starts with exactly one Common Pool — the default, shared bucket",
      "Anything you create beyond that is a Reserved pool — for a marketplace, a store transfer, or any other segregation",
      "A pool is scoped to one client and one fulfillment location, never shared across either",
    ],
    recap: [
      "Creating a pool doesn't move any stock — it just opens an empty bucket",
      "Moving stock between Common and Reserved happens through Reservations",
      "Perishable SKUs may need a Batch ID when reserving, to specify which batch moves",
      "Inward Pool Allocation can route incoming stock straight into pools by percentage, skipping manual moves",
    ],
  },
  quiz: [
    {
      question: "By default, a new client-location pair has…",
      choices: ["No pool at all", "One Common Pool", "One Reserved Pool", "Both Common and Reserved"],
      answer: 1,
      explain: "Every client-location pair starts with exactly one Common Pool, created automatically.",
    },
    {
      question: "You create a pool named 'Marketplace Pool'. What type is it?",
      choices: ["COMMON", "RESERVED", "It has no type", "Whatever you choose"],
      answer: 1,
      explain: "Anything created beyond the default Common Pool is a Reserved pool.",
    },
    {
      question: "Can two Common Pools exist for the same client at the same fulfillment location?",
      choices: ["Yes, unlimited", "Yes, up to 2", "No, only one is ever allowed", "Only for perishable SKUs"],
      answer: 2,
      explain: "The Common Pool is unique per client-location pair — a hard constraint.",
    },
    {
      question: "After creating a Reserved pool, how do you actually move stock into it?",
      choices: [
        "It fills automatically",
        "Through the Reservations screen",
        "By creating the pool a second time",
        "Stock cannot move between pools",
      ],
      answer: 1,
      explain: "Create Inventory Pool only opens the bucket — Reservations is what allocates or deallocates stock into it.",
    },
  ],
  steps: [
    {
      element: "#pool-existing",
      title: "Create Inventory Pool",
      description:
        "Physical stock always lives in WMS. OMS can virtually split it into <strong>pools</strong> per client and fulfillment location — for allocation, reservation, and channel exposure. Every pair starts with one <strong>Common Pool</strong>, shown below.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Create",
      skillIndex: 1,
    },
    {
      element: "#pool-location",
      title: "Fulfillment Location *",
      description:
        "Required. A pool is scoped to exactly one location — stock in this pool never crosses to another warehouse.",
      practicePrompt: "Demo Central Warehouse",
      required: true,
      expected: { type: "select", selector: "#pool-location", value: "demo-central-warehouse" },
      side: "right",
      skillLabel: "Create",
      skillIndex: 1,
    },
    {
      element: "#pool-name",
      title: "Name *",
      description: "Required. Name it for what it's actually for. Example: <strong>Marketplace Pool</strong>",
      practicePrompt: "Marketplace Pool",
      required: true,
      commonMistakes: "A vague name like 'Pool 2' — six months later nobody remembers what it was for.",
      expected: { type: "input", selector: "#pool-name", value: "Marketplace Pool" },
      side: "right",
      skillLabel: "Create",
      skillIndex: 1,
    },
    {
      element: "#pool-btn-submit",
      title: "Submit",
      description:
        "Creates the pool — as a <strong>Reserved</strong> pool, since only the automatic default is ever Common. It starts empty; stock only arrives via Reservations or an inward pool allocation strategy.",
      expected: { type: "action" },
      onWatchFill: () => {
        document.getElementById("pool-btn-submit")?.click();
      },
      side: "top",
      skillLabel: "Create",
      skillIndex: 1,
    },
    {
      element: "#pool-table",
      title: "Common vs Reserved",
      description:
        "Marketplace Pool now sits alongside the Common Pool for this location — <strong>RESERVED</strong>, distinct from the one <strong>COMMON</strong> pool that's always there by default.",
      expected: { type: "action" },
      side: "top",
      skillLabel: "Create",
      skillIndex: 1,
    },
  ],
};
