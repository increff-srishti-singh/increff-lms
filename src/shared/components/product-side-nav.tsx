"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/shared/lib/curriculum";
import { withStartTour } from "@/shared/lib/tour-registry";
import { withChoosePath } from "@/shared/lib/learning-path";

interface ProductSideNavProps {
  open: boolean;
  onClose: () => void;
}

export function ProductSideNav({ open, onClose }: ProductSideNavProps) {
  const pathname = usePathname();
  const wmsMods = MODULES.filter((m) => m.track === "WMS");
  const omsMods = MODULES.filter((m) => m.track === "OMS");

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const earlyWms = wmsMods.filter((m) => m.number <= 4);
  const pickingMods = wmsMods.filter((m) => m.number === 5 || m.number === 6);
  const packingMods = wmsMods.filter((m) => m.number >= 7 && m.number <= 9);

  return (
    <aside className={`product-side-nav${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="product-side-nav-head">
        <span className="product-side-nav-title">Navigation</span>
        <button type="button" className="icon-btn" aria-label="Close menu" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M18.3 5.71L12 12.01l-6.3-6.3-1.4 1.42 6.29 6.3-6.3 6.29 1.42 1.41L12 14.41l6.29 6.3 1.41-1.41-6.3-6.3 6.3-6.29z" />
          </svg>
        </button>
      </div>

      <nav className="product-side-nav-body">
        <div className="product-side-nav-section">
          <div className="product-side-nav-label">WMS</div>
          {earlyWms.map((mod) => (
            <Link
              key={mod.id}
              href={withStartTour(mod.href)}
              className={`product-side-nav-link${isActive(mod.href) ? " active" : ""}`}
              onClick={onClose}
            >
              <span className="product-side-nav-num">{mod.number}</span>
              {mod.title}
            </Link>
          ))}

          <Link
            href={withChoosePath("/wms/pick-pending", "picking")}
            className={`product-side-nav-link${
              pathname.startsWith("/wms/pick-") ? " active" : ""
            }`}
            onClick={onClose}
          >
            <span className="product-side-nav-num">5</span>
            B2C Picking
          </Link>
          {pickingMods.map((mod) => (
            <Link
              key={mod.id}
              href={withStartTour(mod.href)}
              className={`product-side-nav-link product-side-nav-link-sub${
                isActive(mod.href) ? " active" : ""
              }`}
              onClick={onClose}
            >
              <span className="product-side-nav-num">{mod.number}</span>
              {mod.title}
            </Link>
          ))}

          <Link
            href={withChoosePath("/wms/packing", "packing")}
            className={`product-side-nav-link${
              pathname === "/wms/packing" ||
              pathname.startsWith("/wms/manifests") ||
              pathname.startsWith("/wms/handover")
                ? " active"
                : ""
            }`}
            onClick={onClose}
          >
            <span className="product-side-nav-num">7</span>
            B2C Packing
          </Link>
          {packingMods.map((mod) => (
            <Link
              key={mod.id}
              href={withStartTour(mod.href)}
              className={`product-side-nav-link product-side-nav-link-sub${
                isActive(mod.href) ? " active" : ""
              }`}
              onClick={onClose}
            >
              <span className="product-side-nav-num">{mod.number}</span>
              {mod.title}
            </Link>
          ))}
        </div>

        <div className="product-side-nav-section">
          <div className="product-side-nav-label">OMS</div>
          {omsMods.map((mod) => (
            <Link
              key={mod.id}
              href={withStartTour(mod.href)}
              className={`product-side-nav-link${isActive(mod.href) ? " active" : ""}`}
              onClick={onClose}
            >
              <span className="product-side-nav-num">{mod.number}</span>
              {mod.title}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
