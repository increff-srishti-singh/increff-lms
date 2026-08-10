"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { WmsFormTour } from "@/features/wms/inward/gate-entry/tour-config";
import { showToast, openModal, closeModal } from "@/shared/lib/tour-utils";

export default function NewGateEntryPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF WMS" showTraining onStartTraining={() => startTraining(WmsFormTour)} />
      <Breadcrumb
        items={[
          { label: "Gate Entry", href: "/wms/gate-entry" },
          { label: "New Inward Gate Entry" },
        ]}
      />

      <main className="page-content">
        <div className="form-tabs">
          <button type="button" className="form-tab active" id="tab-create">
            Create Gate Entry
          </button>
          <button type="button" className="form-tab" id="tab-map">
            Map External Batch
          </button>
        </div>

        <div className="form-card" id="gate-entry-form">
          <div className="form-grid">
            <div className="form-col">
              <div className="form-field-row" id="field-po-sto">
                <label>
                  PO / STO No. <span className="req">*</span>
                </label>
                <div className="control">
                  <button type="button" className="link-select" id="btn-open-orders" onClick={() => openModal("modal-select-orders")}>
                    Select
                  </button>
                </div>
              </div>
              <div className="form-field-row" id="field-asn">
                <label>ASN</label>
                <div className="control">
                  <button type="button" className="link-select" id="btn-select-asn">
                    Select
                  </button>
                </div>
              </div>
              <div className="form-field-row" id="field-doc-type">
                <label htmlFor="wms-doc-type">
                  Document Type <span className="req">*</span>
                </label>
                <div className="control">
                  <select id="wms-doc-type" defaultValue="">
                    <option value="">Select Document Type</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Delivery Challan">Delivery Challan</option>
                    <option value="Packing List">Packing List</option>
                  </select>
                </div>
              </div>
              <div className="form-field-row" id="field-doc-no">
                <label htmlFor="wms-doc-no">
                  Document No. <span className="req">*</span>
                </label>
                <div className="control">
                  <input type="text" id="wms-doc-no" placeholder="Document No." />
                </div>
              </div>
              <div className="form-field-row" id="field-doc-date">
                <label htmlFor="wms-doc-date">
                  Document Generation Date <span className="req">*</span>
                </label>
                <div className="control field-date">
                  <input type="text" id="wms-doc-date" placeholder="dd-mm-yyyy" />
                  <span className="cal-icon">📅</span>
                </div>
              </div>
              <div className="form-field-row" id="field-total-qty">
                <label htmlFor="wms-total-qty">
                  Total Quantity <span className="req">*</span>
                </label>
                <div className="control">
                  <input type="text" id="wms-total-qty" placeholder="Total Quantity" />
                </div>
              </div>
              <div className="form-field-row" id="field-total-value">
                <label htmlFor="wms-total-value">
                  Total Value <span className="req">*</span>
                </label>
                <div className="control">
                  <input type="text" id="wms-total-value" placeholder="Total Value" />
                </div>
              </div>
              <div className="form-field-row" id="field-upload-doc">
                <label>
                  Upload Document <span className="req">*</span>
                </label>
                <div className="control file-input">
                  <input type="file" id="wms-upload-doc" />
                </div>
              </div>
            </div>

            <div className="form-col">
              <div className="form-field-row" id="field-transporter">
                <label htmlFor="wms-transporter">
                  Transporter <span className="req">*</span>
                </label>
                <div className="control">
                  <input type="text" id="wms-transporter" placeholder="Transporter" />
                </div>
              </div>
              <div className="form-field-row" id="field-vehicle">
                <label htmlFor="wms-vehicle">
                  Vehicle No. <span className="req">*</span>
                </label>
                <div className="control">
                  <input type="text" id="wms-vehicle" placeholder="Vehicle No." />
                </div>
              </div>
              <div className="form-field-row" id="field-material-date">
                <label htmlFor="wms-material-date">
                  Material Received On <span className="req">*</span>
                </label>
                <div className="control field-date">
                  <input type="text" id="wms-material-date" placeholder="dd-mm-yyyy" />
                  <span className="cal-icon">📅</span>
                </div>
              </div>
              <div className="form-field-row" id="field-eway">
                <label>
                  Upload E-way bill <span className="req">*</span>
                </label>
                <div className="control file-input">
                  <input type="file" id="wms-upload-eway" />
                </div>
              </div>
              <div className="form-field-row" id="field-lr-no">
                <label htmlFor="wms-lr-no">
                  LR / AWB / BL No. <span className="req">*</span>
                </label>
                <div className="control">
                  <input type="text" id="wms-lr-no" placeholder="LR / AWB / BL No." />
                </div>
              </div>
              <div className="form-field-row" id="field-upload-lr">
                <label>
                  Upload LR / AWB / BL <span className="req">*</span>
                </label>
                <div className="control file-input">
                  <input type="file" id="wms-upload-lr" />
                </div>
              </div>
              <div className="form-field-row" id="field-remarks">
                <label htmlFor="wms-remarks">Remarks</label>
                <div className="control">
                  <textarea id="wms-remarks" placeholder="Enter Remarks" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer" id="form-actions">
            <button type="button" className="btn btn-outline" id="wms-btn-submit" onClick={() => showToast("Successful")}>
              Submit
            </button>
            <button
              type="button"
              className="btn btn-outline"
              id="wms-btn-submit-boxes"
              onClick={() => {
                showToast("Submitted — opening Receive Inward Boxes");
                setTimeout(() => {
                  window.location.href = "/wms/receive-boxes";
                }, 500);
              }}
            >
              Submit and Receive Boxes
            </button>
            <button
              type="button"
              className="btn btn-grey"
              id="wms-btn-reset"
              onClick={() => {
                document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
                  "#gate-entry-form input, #gate-entry-form select, #gate-entry-form textarea"
                ).forEach((el) => {
                  if (el instanceof HTMLInputElement && el.type === "file") el.value = "";
                  else if (el instanceof HTMLSelectElement) el.selectedIndex = 0;
                  else el.value = "";
                });
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Select New Orders Modal */}
        <div
          className="modal-overlay"
          id="modal-select-orders"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal("modal-select-orders");
          }}
        >
          <div className="modal wide" id="modal-select-orders-panel">
            <div className="modal-header">
              <h3>Select New Orders</h3>
              <button type="button" className="modal-close" aria-label="Close" onClick={() => closeModal("modal-select-orders")}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="filter-row" style={{ marginBottom: 16 }}>
                <div className="field field-date" id="orders-start-wrap">
                  <label htmlFor="orders-start-date">Start Date</label>
                  <input type="text" id="orders-start-date" placeholder="dd-mm-yyyy" />
                  <span className="cal-icon">📅</span>
                </div>
                <div className="field field-date" id="orders-end-wrap">
                  <label htmlFor="orders-end-date">End Date</label>
                  <input type="text" id="orders-end-date" placeholder="dd-mm-yyyy" />
                  <span className="cal-icon">📅</span>
                </div>
                <div className="field" id="orders-client-wrap">
                  <label htmlFor="orders-client">
                    Client <span className="req">*</span>
                  </label>
                  <select id="orders-client" defaultValue="">
                    <option value="">Select Client</option>
                    <option value="retailcorp">RetailCorp India</option>
                    <option value="fashionhub">FashionHub</option>
                    <option value="megamart">MegaMart</option>
                  </select>
                </div>
                <div className="field" id="orders-supplier-wrap">
                  <label htmlFor="orders-supplier">Supplier</label>
                  <select id="orders-supplier" defaultValue="all">
                    <option value="all">All</option>
                    <option value="acme">Acme Supplies</option>
                    <option value="fastlog">Fast Logistics Pvt Ltd</option>
                  </select>
                </div>
                <div className="field" id="orders-po-wrap">
                  <label htmlFor="orders-external-po">External PO No.</label>
                  <input type="text" id="orders-external-po" placeholder="External PO No." />
                </div>
                <div className="field-actions">
                  <button
                    type="button"
                    className="btn btn-blue"
                    id="orders-btn-search"
                    onClick={() => {
                      const tbody = document.getElementById("orders-table-body");
                      if (tbody) {
                        tbody.innerHTML =
                          "<tr><td>RetailCorp India</td><td>Acme Supplies</td><td>IPO-55210</td><td>B2B</td><td>PO-12345</td><td>10-07-2026</td></tr>";
                      }
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="data-table-wrap" id="orders-results-table">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Supplier</th>
                      <th>Internal PO No.</th>
                      <th>Channel</th>
                      <th>External PO No.</th>
                      <th>Ordered Date</th>
                    </tr>
                  </thead>
                  <tbody id="orders-table-body">
                    <tr className="empty-row">
                      <td colSpan={6}>No Data to Show</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => closeModal("modal-select-orders")}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-blue"
                id="btn-select-po"
                onClick={() => closeModal("modal-select-orders")}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
