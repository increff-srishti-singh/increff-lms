"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/** Matches original .breadcrumb-bar from common.css / gate-entry.html */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const last = items[items.length - 1];
  return (
    <div className="breadcrumb-bar">
      <Link href="/" aria-label="Home">
        <svg className="icon-sm icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </Link>
      <span className="sep">/</span>
      {items.length > 1 ? (
        items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </React.Fragment>
        ))
      ) : (
        <span>{last?.label}</span>
      )}
      <button className="star" type="button" aria-label="Favorite">
        ☆
      </button>
    </div>
  );
}
