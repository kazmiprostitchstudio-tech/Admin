import { useState, useEffect } from "react";
import { FiSave, FiCheck, FiGlobe, FiDollarSign, FiPercent, FiTruck } from "react-icons/fi";
import "./Settings.css";

const DEFAULT_SETTINGS = {
  storeName: "SHOP.CO Official Store",
  supportEmail: "support@shopco.com",
  phone: "+1 (800) 555-0199",
  currency: "USD ($)",
  taxRate: 5.0,
  freeShippingOver: 200,
  maintenanceMode: false,
};

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("shopco_admin_settings", JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="settings-module">
      <div className="module-top-header">
        <div>
          <h2>Store Configuration</h2>
          <p>Manage store profile, currencies, tax calculation rules, and checkout parameters.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="toast-success-banner">
          <FiCheck /> Store settings successfully synchronized to LocalStorage!
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-card-form">
        {/* General Identity */}
        <div className="form-section">
          <h3>Store Identity</h3>
          <div className="inputs-grid">
            <label>
              Brand Name
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                required
              />
            </label>
            <label>
              Support Contact Email
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                required
              />
            </label>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="form-section">
          <h3>Financial & Tax Setup</h3>
          <div className="inputs-grid">
            <label>
              Operating Currency
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="PKR (Rs.)">PKR (Rs.) - Pakistani Rupee</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </label>
            <label>
              Standard Sales Tax (%)
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              />
            </label>
            <label>
              Free Shipping Minimum Cart Value ($)
              <input
                type="number"
                min="0"
                value={settings.freeShippingOver}
                onChange={(e) => setSettings({ ...settings, freeShippingOver: Number(e.target.value) })}
              />
            </label>
          </div>
        </div>

        {/* Store Control Toggles */}
        <div className="form-section">
          <h3>Store Operations</h3>
          <div className="toggle-row">
            <div>
              <span className="toggle-title">Store Maintenance Mode</span>
              <p className="toggle-desc">Temporarily block customer checkouts for catalog restock.</p>
            </div>
            <input
              type="checkbox"
              className="switch-checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
          </div>
        </div>

        <div className="settings-submit-footer">
          <button type="submit" className="btn-save-settings">
            <FiSave /> Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
}