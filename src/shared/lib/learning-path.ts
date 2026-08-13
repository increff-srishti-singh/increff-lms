import type { TourConfig } from "@/features/learning/types";
import { withStartTour } from "@/shared/lib/tour-registry";

export type PathGroupId = "picking" | "packing";

export interface LearningPathOption {
  id: string;
  title: string;
  description: string;
  href: string;
  pageKey: string;
}

export type LearningNext =
  | { type: "module"; href: string; title: string }
  | { type: "path-group"; group: PathGroupId; title: string }
  | { type: "dashboard" };

/** Ordered WMS learning chain (by tour pageKey). */
export const LEARNING_NEXT_BY_PAGE_KEY: Record<string, LearningNext> = {
  "wms-list": { type: "module", href: "/wms/receive-boxes", title: "Receive Inward Boxes" },
  "wms-form": { type: "module", href: "/wms/receive-boxes", title: "Receive Inward Boxes" },
  "wms-receive": { type: "module", href: "/wms/grn", title: "GRN" },
  "wms-grn": { type: "module", href: "/wms/putaway", title: "Put Away" },
  "wms-putaway": { type: "path-group", group: "picking", title: "B2C Picking" },
  "wms-pick-pending": { type: "module", href: "/wms/pick-item", title: "Piece Pick Item" },
  "wms-pick-item": { type: "path-group", group: "packing", title: "B2C Packing" },
  "wms-packing": { type: "module", href: "/wms/manifests", title: "Manifest" },
  "wms-manifest": { type: "module", href: "/wms/handover", title: "Handover" },
  "wms-handover": { type: "dashboard" },
  // OMS: the client must exist before locations can be mapped to it.
  "oms-client": { type: "module", href: "/oms/fulfillment-locations", title: "Fulfillment Locations" },
  // A fulfillment location is unusable by a client until it is mapped.
  "oms": { type: "module", href: "/oms/client-location-mapping", title: "Client Fulfillment Location Mapping" },
  "oms-client-mapping": { type: "module", href: "/oms/suppliers", title: "Suppliers" },
  "oms-supplier": { type: "module", href: "/oms/customers", title: "Customers" },
  // Both parties' addresses are covered by the same Partner Locations screen.
  "oms-customer": { type: "module", href: "/oms/partner-locations", title: "Partner Locations" },
  "oms-partner-location": { type: "module", href: "/oms/products", title: "Product Settings" },
  "oms-product": { type: "module", href: "/oms/inventory-pool", title: "Inventory" },
  // Satellite pages reached only via Products' scenario picker — always return to
  // dashboard, never chain onward, regardless of what comes after Products later.
  "oms-product-attributes": { type: "dashboard" },
  "oms-product-dimensions": { type: "dashboard" },
  "oms-inventory": { type: "dashboard" },
};

/**
 * Per-scenario overrides, checked before LEARNING_NEXT_BY_PAGE_KEY. Key: `${pageKey}::${scenarioId}`.
 * Used by Products: its "product" scenario continues the normal OMS chain (no override
 * needed — it falls through to the table above), but its other scenarios (attribute
 * configuration, SKU dimensions, batch details, missing image, pack box master) are
 * secondary deep-dives that return to the dashboard instead of continuing the chain.
 */
export const LEARNING_NEXT_OVERRIDE_BY_SCENARIO: Record<string, LearningNext> = {};

export const PATH_GROUPS: Record<
  PathGroupId,
  { title: string; intro: string; options: LearningPathOption[] }
> = {
  picking: {
    title: "B2C Picking",
    intro: "Choose which picking screen to learn first.",
    options: [
      {
        id: "pick-pending",
        title: "Piece Pick Pending",
        description: "Monitor zone / aisle pendency and assign pick work.",
        href: "/wms/pick-pending",
        pageKey: "wms-pick-pending",
      },
      {
        id: "pick-item",
        title: "Piece Pick Item",
        description: "Scan location and item, then confirm the pick.",
        href: "/wms/pick-item",
        pageKey: "wms-pick-item",
      },
    ],
  },
  packing: {
    title: "B2C Packing",
    intro: "Choose which packing screen to learn first.",
    options: [
      {
        id: "packing",
        title: "Piece Packing",
        description: "Scan items, complete packing, print label and AWB.",
        href: "/wms/packing",
        pageKey: "wms-packing",
      },
      {
        id: "manifest",
        title: "Manifest",
        description: "Create / close transporter manifests and print.",
        href: "/wms/manifests",
        pageKey: "wms-manifest",
      },
      {
        id: "handover",
        title: "Handover",
        description: "Hand shipments to the transporter by manifest or AWB.",
        href: "/wms/handover",
        pageKey: "wms-handover",
      },
    ],
  },
};

export const CHOOSE_PATH_PARAM = "choosePath";

export function getLearningNext(
  pageKey: string | null | undefined,
  scenarioId?: string | null
): LearningNext | null {
  if (!pageKey) return null;
  if (scenarioId) {
    const override = LEARNING_NEXT_OVERRIDE_BY_SCENARIO[`${pageKey}::${scenarioId}`];
    if (override) return override;
  }
  return LEARNING_NEXT_BY_PAGE_KEY[pageKey] || null;
}

export function continueLearningHref(next: Extract<LearningNext, { type: "module" }>): string {
  return withStartTour(next.href);
}

export function pathOptionStartHref(option: LearningPathOption): string {
  return withStartTour(option.href);
}

/** Used when a hub entry wants path choice before mode picker. */
export function withChoosePath(href: string, group: PathGroupId): string {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set(CHOOSE_PATH_PARAM, group);
  params.set("startTour", "1");
  return `${path}?${params.toString()}`;
}

export function continueLabelFor(config: TourConfig | null, scenarioId?: string | null): string {
  const next = getLearningNext(config?.pageKey, scenarioId);
  if (!next) return "Continue learning";
  if (next.type === "dashboard") return "Back to dashboard";
  if (next.type === "path-group") return `Continue to ${next.title}`;
  return `Continue to ${next.title}`;
}
