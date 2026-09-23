import { useState } from "react";
import { FiPlus, FiTrash2, FiTag, FiCheck, FiCopy, FiX, FiCalendar, FiPercent } from "react-icons/fi";
import { useAdmin } from "../../context/AdminContext";
import "./Coupons.css";

export default function Coupons() {
  const { coupons, addCoupon, deleteCoupon } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form Inputs
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [type, setType] = useState("Percentage");

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!code.trim() || !discount) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      type,
    });

    setCode("");
    setDiscount("");
    setIsModalOpen(false);
  };

  const handleCopy = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="coupons-module">
      <div className="module-top-header">
        <div>
          <h2>Promotional Coupons & Vouchers</h2>
          <p>Generate promo vouchers linked directly to the front-end checkout flow.</p>
        </div>
        <button type="button" className="btn-add-primary" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      {/* Coupons Cards Grid */}
      <div className="coupons-grid">
        {coupons.map((cpn) => (
          <div key={cpn.id} className="coupon-ticket-card">
            <div className="ticket-left">
              <div className="discount-circle">
                <FiPercent />
              </div>
              <div className="discount-info">
                <h3>{cpn.type === "Percentage" ? `${cpn.discount}% OFF` : `$${cpn.discount} OFF`}</h3>
                <span className="cpn-sub">{cpn.type} Discount</span>
              </div>
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-right">
              <div className="code-pill-box">
                <span className="coupon-code-text">{cpn.code}</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => handleCopy(cpn.code)}
                  title="Copy to clipboard"
                >
                  {copiedCode === cpn.code ? <FiCheck style={{ color: "#10b981" }} /> : <FiCopy />}
                </button>
              </div>

              <div className="cpn-meta">
                <span>Redeemed: <strong>{cpn.used} times</strong></span>
                <span className={`badge ${cpn.status.toLowerCase()}`}>{cpn.status}</span>
              </div>

              <button
                type="button"
                className="btn-trash-coupon"
                onClick={() => {
                  if (window.confirm(`Delete coupon ${cpn.code}?`)) deleteCoupon(cpn.id);
                }}
                title="Remove Coupon"
              >
                <FiTrash2 /> Remove Voucher
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Issue New Coupon</h3>
              <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="modal-form">
              <label>
                Promo Code *
                <input
                  type="text"
                  placeholder="e.g. FESTIVE30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Discount Type
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount ($)</option>
                  </select>
                </label>

                <label>
                  Discount Value *
                  <input
                    type="number"
                    min="1"
                    placeholder="20"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}