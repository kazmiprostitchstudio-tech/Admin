import { useState, useEffect } from "react";
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiRotateCcw, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiSearch, 
  FiEye, 
  FiX 
} from "react-icons/fi";
import "./Payments.css";

const INITIAL_TRANSACTIONS = [
  {
    txnId: "TXN-88201",
    orderId: "#ORD-9921",
    customer: "Samantha D.",
    method: "Credit Card (Visa)",
    amount: 145,
    fee: 4.20,
    net: 140.80,
    status: "Succeeded",
    date: "2026-09-18 14:32",
  },
  {
    txnId: "TXN-88202",
    orderId: "#ORD-9920",
    customer: "Alex Morgan",
    method: "Stripe",
    amount: 240,
    fee: 6.96,
    net: 233.04,
    status: "Succeeded",
    date: "2026-09-19 09:15",
  },
  {
    txnId: "TXN-88203",
    orderId: "#ORD-9919",
    customer: "Ethan Ramirez",
    method: "Cash on Delivery",
    amount: 180,
    fee: 0.00,
    net: 180.00,
    status: "Pending",
    date: "2026-09-19 11:42",
  },
  {
    txnId: "TXN-88204",
    orderId: "#ORD-9918",
    customer: "Olivia Parker",
    method: "PayPal",
    amount: 180,
    fee: 5.40,
    net: 174.60,
    status: "Succeeded",
    date: "2026-09-19 16:05",
  },
  {
    txnId: "TXN-88205",
    orderId: "#ORD-9917",
    customer: "Daniel Stone",
    method: "Stripe",
    amount: 120,
    fee: 3.48,
    net: 116.52,
    status: "Refunded",
    date: "2026-09-17 10:20",
  },
];

export default function Payments() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_payments");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopco_admin_payments", JSON.stringify(transactions));
  }, [transactions]);

  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Issue Refund Action
  const handleRefund = (txnId) => {
    if (window.confirm("Authorize full refund for this transaction?")) {
      setTransactions(
        transactions.map((t) => (t.txnId === txnId ? { ...t, status: "Refunded" } : t))
      );
      if (selectedTxn?.txnId === txnId) {
        setSelectedTxn((prev) => ({ ...prev, status: "Refunded" }));
      }
    }
  };

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "All" || t.method.includes(methodFilter);
    return matchesSearch && matchesMethod;
  });

  // Financial KPI totals
  const totalSettled = transactions
    .filter((t) => t.status === "Succeeded")
    .reduce((sum, t) => sum + t.net, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === "Refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="payments-module">
      <div className="module-top-header">
        <div>
          <h2>Payments & Gateway Ledger</h2>
          <p>Real-time transaction settlement, processing fees, and refund management.</p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="pay-metrics-grid">
        <div className="pay-kpi-card">
          <div className="kpi-icon-box green"><FiDollarSign /></div>
          <div>
            <span className="lbl">Net Settled Payouts</span>
            <h3>${totalSettled.toFixed(2)}</h3>
          </div>
        </div>
        <div className="pay-kpi-card">
          <div className="kpi-icon-box blue"><FiCreditCard /></div>
          <div>
            <span className="lbl">Processed Transactions</span>
            <h3>{transactions.length}</h3>
          </div>
        </div>
        <div className="pay-kpi-card">
          <div className="kpi-icon-box red"><FiRotateCcw /></div>
          <div>
            <span className="lbl">Total Refunds Issued</span>
            <h3 style={{ color: "#ef4444" }}>${totalRefunded.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="payments-control-bar">
        <div className="pay-search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Txn ID, Order ID, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="pay-filter-tabs">
          {["All", "Stripe", "PayPal", "Credit Card", "Cash on Delivery"].map((m) => (
            <button
              key={m}
              type="button"
              className={`pill-btn ${methodFilter === m ? "active" : ""}`}
              onClick={() => setMethodFilter(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="pay-table-card">
        <div className="table-responsive">
          <table className="pay-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Payment Gateway</th>
                <th>Gross</th>
                <th>Gateway Fee</th>
                <th>Net Payout</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.length > 0 ? (
                filteredTxns.map((t) => (
                  <tr key={t.txnId}>
                    <td style={{ fontWeight: 700 }}>{t.txnId}</td>
                    <td style={{ color: "#2563eb", fontWeight: 600 }}>{t.orderId}</td>
                    <td>{t.customer}</td>
                    <td>
                      <span className="gateway-pill">{t.method}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${t.amount.toFixed(2)}</td>
                    <td style={{ color: "#64748b" }}>-${t.fee.toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>${t.net.toFixed(2)}</td>
                    <td>
                      <span className={`txn-status-badge ${t.status.toLowerCase()}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="txn-action-btns">
                        <button
                          type="button"
                          className="btn-pay-action view"
                          onClick={() => setSelectedTxn(t)}
                          title="View Receipt"
                        >
                          <FiEye />
                        </button>
                        {t.status === "Succeeded" && (
                          <button
                            type="button"
                            className="btn-pay-action refund"
                            onClick={() => handleRefund(t.txnId)}
                            title="Issue Refund"
                          >
                            <FiRotateCcw />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-results-cell">
                    No transactions match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="modal-backdrop" onClick={() => setSelectedTxn(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transaction Receipt</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedTxn(null)}>
                <FiX />
              </button>
            </div>
            <div className="txn-receipt-details">
              <div className="receipt-row">
                <span className="lbl">Transaction ID</span>
                <span className="val">{selectedTxn.txnId}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Associated Order</span>
                <span className="val">{selectedTxn.orderId}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Customer</span>
                <span className="val">{selectedTxn.customer}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Payment Provider</span>
                <span className="val">{selectedTxn.method}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Processing Timestamp</span>
                <span className="val">{selectedTxn.date}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Transaction Status</span>
                <span className={`txn-status-badge ${selectedTxn.status.toLowerCase()}`}>
                  {selectedTxn.status}
                </span>
              </div>

              <div className="receipt-financial-breakdown">
                <div className="fin-line">
                  <span>Gross Charged</span>
                  <span>${selectedTxn.amount.toFixed(2)}</span>
                </div>
                <div className="fin-line">
                  <span>Gateway Fee Deducted</span>
                  <span>-${selectedTxn.fee.toFixed(2)}</span>
                </div>
                <hr className="divider" />
                <div className="fin-line total">
                  <span>Merchant Net Settlement</span>
                  <span>${selectedTxn.net.toFixed(2)}</span>
                </div>
              </div>

              {selectedTxn.status === "Succeeded" && (
                <button
                  type="button"
                  className="refund-submit-btn"
                  onClick={() => handleRefund(selectedTxn.txnId)}
                >
                  <FiRotateCcw /> Refund Full Amount
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}