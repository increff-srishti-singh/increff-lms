import type { TourConfig } from "@/features/learning/types";
import { WmsListTour, WmsFormTour } from "@/features/wms/inward/gate-entry/tour-config";
import { ReceiveBoxesTour } from "@/features/wms/inward/receive-boxes/tour-config";
import { GrnTour } from "@/features/wms/inward/grn/tour-config";
import { PutawayTour } from "@/features/wms/inward/putaway/tour-config";
import { PickPendingTour, PickItemTour } from "@/features/wms/b2c/picking/tour-config";
import { PackingTour, ManifestTour, HandoverTour } from "@/features/wms/b2c/packing/tour-config";
import { ClientsTour } from "@/features/oms/clients/tour-config";
import { OmsTour } from "@/features/oms/fulfillment-locations/tour-config";
import { ClientLocationMappingTour } from "@/features/oms/client-location-mapping/tour-config";
import { SuppliersTour } from "@/features/oms/suppliers/tour-config";
import { CustomersTour } from "@/features/oms/customers/tour-config";
import { PartnerLocationsTour } from "@/features/oms/partner-locations/tour-config";
import { ProductsTour } from "@/features/oms/products/tour-config";

/** pageKey → tour config (mirrors original pageBuilders registry). */
export const TOUR_BY_PAGE_KEY: Record<string, TourConfig> = {
  [WmsListTour.pageKey]: WmsListTour,
  [WmsFormTour.pageKey]: WmsFormTour,
  [ReceiveBoxesTour.pageKey]: ReceiveBoxesTour,
  [GrnTour.pageKey]: GrnTour,
  [PutawayTour.pageKey]: PutawayTour,
  [PickPendingTour.pageKey]: PickPendingTour,
  [PickItemTour.pageKey]: PickItemTour,
  [PackingTour.pageKey]: PackingTour,
  [ManifestTour.pageKey]: ManifestTour,
  [HandoverTour.pageKey]: HandoverTour,
  [ClientsTour.pageKey]: ClientsTour,
  [OmsTour.pageKey]: OmsTour,
  [ClientLocationMappingTour.pageKey]: ClientLocationMappingTour,
  [SuppliersTour.pageKey]: SuppliersTour,
  [CustomersTour.pageKey]: CustomersTour,
  [PartnerLocationsTour.pageKey]: PartnerLocationsTour,
  [ProductsTour.pageKey]: ProductsTour,
};

/** Primary learning module path → tour (navbar / dashboard entry). */
export const TOUR_BY_HREF: Record<string, TourConfig> = {
  "/wms/gate-entry": WmsListTour,
  "/wms/gate-entry/new": WmsFormTour,
  "/wms/receive-boxes": ReceiveBoxesTour,
  "/wms/grn": GrnTour,
  "/wms/putaway": PutawayTour,
  "/wms/pick-pending": PickPendingTour,
  "/wms/pick-item": PickItemTour,
  "/wms/packing": PackingTour,
  "/wms/manifests": ManifestTour,
  "/wms/handover": HandoverTour,
  "/oms/clients": ClientsTour,
  "/oms/fulfillment-locations": OmsTour,
  "/oms/client-location-mapping": ClientLocationMappingTour,
  "/oms/suppliers": SuppliersTour,
  "/oms/customers": CustomersTour,
  "/oms/partner-locations": PartnerLocationsTour,
  "/oms/products": ProductsTour,
};

export const AUTO_CONTINUE_KEY = "increff-tour-auto-continue";
export const START_TOUR_PARAM = "startTour";

export function getTourByPageKey(pageKey: string | null | undefined): TourConfig | null {
  if (!pageKey) return null;
  return TOUR_BY_PAGE_KEY[pageKey] || null;
}

export function getTourByPathname(pathname: string | null | undefined): TourConfig | null {
  if (!pathname) return null;
  if (TOUR_BY_HREF[pathname]) return TOUR_BY_HREF[pathname];
  // Longest prefix match (e.g. nested routes)
  const match = Object.keys(TOUR_BY_HREF)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? TOUR_BY_HREF[match] : null;
}

/** Append ?startTour=1 so the destination opens the mode picker / tour. */
export function withStartTour(href: string): string {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set(START_TOUR_PARAM, "1");
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}
