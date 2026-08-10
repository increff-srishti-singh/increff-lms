"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { WmsListTour } from "@/features/wms/inward/gate-entry/tour-config";

export default function GateEntryPage() {
  const { startTraining } = useTrainingContext();

  const runSearch = () => {
    const tbody = document.querySelector("#wms-results-table tbody");
    if (!tbody) return;
    tbody.innerHTML = `<tr>
      <td>GE-10042</td>
      <td>PO-12345</td>
      <td>Acme Supplies</td>
      <td>—</td>
      <td>Wed, 22 Jul 2026 IST</td>
      <td><span class="status-open">OPEN</span></td>
      <td class="action-cell">
        <a class="action-icon" href="/wms/receive-boxes" title="Receive Boxes">📦</a>
        <a class="action-icon" href="/wms/grn" title="GRN">☰</a>
        <button type="button" class="action-icon" title="Close Entry">⛔</button>
      </td>
    </tr>`;
  };

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(WmsListTour)} />
      <Breadcrumb items={[{ label: "Gate Entry" }]} />

      <main className="page-content">
        <div className="filter-panel" id="wms-filter-panel">
          <div className="filter-row">
            <div className="field" id="wms-search-by-wrap">
              <label htmlFor="wms-search-by">Search By</label>
              <select id="wms-search-by" defaultValue="date-client-supplier">
                <option value="date-client-supplier">Date, Client and S...</option>
                <option value="gate-entry-id">Gate Entry ID</option>
                <option value="external-po">External PO No.</option>
              </select>
            </div>
            <div className="field field-date" id="wms-start-date-wrap">
              <label htmlFor="wms-start-date">Start Date</label>
              <input type="text" id="wms-start-date" placeholder="dd-mm-yyyy" />
              <span className="cal-icon">📅</span>
            </div>
            <div className="field field-date" id="wms-end-date-wrap">
              <label htmlFor="wms-end-date">End Date</label>
              <input type="text" id="wms-end-date" placeholder="dd-mm-yyyy" />
              <span className="cal-icon">📅</span>
            </div>
            <div className="field" id="wms-supplier-wrap">
              <label htmlFor="wms-supplier">Supplier</label>
              <select id="wms-supplier" defaultValue="all">
                <option value="all">All</option>
                <option value="acme">Acme Supplies</option>
                <option value="fastlog">Fast Logistics Pvt Ltd</option>
                <option value="nordic">Nordic Traders</option>
              </select>
            </div>
            <div className="field-actions">
              <button type="button" className="btn btn-blue" id="wms-btn-search" onClick={runSearch}>
                Search
              </button>
              <a
                href="/wms/gate-entry/new"
                className="btn btn-green"
                id="wms-btn-add"
                style={{ color: "#fff" }}
              >
                Add New Entry
              </a>
            </div>
          </div>
          <div className="filter-row">
            <div className="field" id="wms-page-size-wrap">
              <label htmlFor="wms-page-size">Page Size</label>
              <select id="wms-page-size" defaultValue="100">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="data-table-wrap" id="wms-results-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Gate Entry ID</th>
                <th>External PO No.</th>
                <th>Supplier</th>
                <th>ASN Code</th>
                <th>Material Received On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="empty-row">
                <td colSpan={7}>No Data to Show</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
