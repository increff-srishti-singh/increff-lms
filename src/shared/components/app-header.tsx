"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductSideNav } from "@/shared/components/product-side-nav";
import { useTrainingStore } from "@/features/learning/stores/training-store";

interface AppHeaderProps {
  title?: string;
  showTraining?: boolean;
  onStartTraining?: () => void;
}

export function AppHeader({ title = "INCREFF WMS", showTraining = false, onStartTraining }: AppHeaderProps) {
  const [navOpen, setNavOpen] = useState(true);
  const trainingPhase = useTrainingStore((s) => s.phase);

  // The nav drawer animates page content via margin-left. If it is open while a tour is
  // active, Shepherd can measure its target mid-transition and highlight the wrong spot —
  // so force it closed for the duration of any training UI, regardless of the toggle.
  const navVisible = trainingPhase === "idle" && navOpen;

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button
            className="icon-btn"
            type="button"
            aria-label="Menu"
            aria-expanded={navVisible}
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
            </svg>
          </button>
          <span className="logo-mark">A</span>
          <span className="brand-name">{title}</span>
          <Link href="/" className="header-back-home" title="Back to Learning Path">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Back to Learning Path
          </Link>
          <div className="facility-select">
            <svg className="icon-sm icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M3 21V7l9-4 9 4v14H3zm2-2h14V8.5L12 5.5 5 8.5V19z" />
            </svg>
            confluxe (IST, +05:30)
            <svg className="icon-sm icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
        </div>
        <div className="header-center">
          <div className="global-search">
            <svg className="icon-sm icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input type="text" placeholder="Search anything..." readOnly />
            <span className="kbd-hint">⌘ + K</span>
          </div>
        </div>
        <div className="header-right">
          {showTraining && onStartTraining && (
            <button type="button" className="btn-start-demo" onClick={onStartTraining}>
              Start Training
            </button>
          )}
          <span className="user-name">srishti.singh</span>
          <button className="icon-btn" type="button" aria-label="Apps">
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
            </svg>
          </button>
        </div>
      </header>
      <ProductSideNav open={navVisible} onClose={() => setNavOpen(false)} />
    </>
  );
}
