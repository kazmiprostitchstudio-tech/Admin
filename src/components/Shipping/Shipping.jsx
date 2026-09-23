import { useState, useEffect } from "react";
import { 
  FiTruck, 
  FiPackage, 
  FiMapPin, 
  FiCheckCircle, 
  FiClock, 
  FiSearch, 
  FiPlus, 
  FiX, 
  FiExternalLink 
} from "react-icons/fi";
import "./Shipping.css";

const INITIAL_SHIPMENTS = [
  {
    shipmentId: "SHP-7701",
    orderId: "#ORD-9921",
    customer: "Samantha D.",
    destination: "New York, USA",
    courier: "DHL Express",
    trackingNo: "DHL-98214309",
    status: "Delivered",
    dispatchDate: "2026-09-18",
    estDelivery: "2026-09-20",
  },
  {
    shipmentId: "SHP-7702",
    orderId: "#ORD-9920",
    customer: "Alex Morgan",
    destination: "Los Angeles, USA",
    courier: "FedEx",
    trackingNo: "FDX-44120931",
    status: "In Transit",
    dispatchDate: "2026-09-19",
    estDelivery: "2026-09-22",
  },
  {
    shipmentId: "SHP-7703",
    orderId: "#ORD-9919",
    customer: "Ethan Ramirez",
    destination: "Chicago, USA",
    courier: "TCS Courier",
    trackingNo: "TCS-11029482",
    status: "Out for Delivery",
    dispatchDate: "2026-09-19",
    estDelivery: "2026-09-21",
  },
  {
    shipmentId: "SHP-7704",
    orderId: "#ORD-9918",
    customer: "Olivia Parker",
    destination: "Seattle, USA",
    courier: "DHL Express",
    trackingNo: "DHL-67291034",
    status: "Preparing",
    dispatchDate: "2026-09-20",
    estDelivery: "2026-09-24",
  },
];

export default function Shipping() {
  const [shipments, setShipments] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_shipping");
      return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
    } catch {
      return INITIAL_SHIPMENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopco_admin_shipping", JSON.stringify(shipments));
  }, [shipments]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Shipment Form State
  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState("");
  const [destination, setDestination] = useState("");
  const [courier, setCourier] = useState("DHL Express");

  const handleUpdateStatus = (id, newStatus) => {
    setShipments(
      shipments.map((s) => (s.shipmentId === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleCreateShipment = (e) => {
    e.preventDefault();
    if (!orderId || !customer || !destination) return;

    const newShip = {
      shipmentId: `SHP-${Math.floor(7000 + Math.random() * 2000)}`,
      orderId: orderId.startsWith("#") ? orderId : `#${orderId}`,
      customer,
      destination,
      courier,
      trackingNo: `${courier.slice(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: "Preparing",
      dispatchDate: new Date().toISOString().split("T")[0],
      estDelivery: "3-5 Business Days",
    };

    setShipments([newShip, ...shipments]);
    setOrderId("");
    setCustomer("");
    setDestination("");
    setIsModalOpen(false);
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trackingNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="shipping-module">
      <div className="module-top-header">
        <div>
          <h2>Shipping & Dispatch Logistics</h2>
          <p>Track courier dispatches, update delivery checkpoints, and assign tracking IDs.</p>
        </div>
        <button type="button" className="btn-create-shipment" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Dispatch New Shipment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="shipping-kpi-grid">
        <div className="shp-kpi-card">
          <div className="shp-ico blue"><FiTruck /></div>
          <div>
            <span className="lbl">Active Dispatches</span>
            <h3>{shipments.filter((s) => s.status !== "Delivered").length}</h3>
          </div>
        </div>
        <div className="shp-kpi-card">
          <div className="shp-ico yellow"><FiClock /></div>
          <div>
            <span className="lbl">In Transit</span>
            <h3>{shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length}</h3>
          </div>
        </div>
        <div className="shp-kpi-card">
          <div className="shp-ico green"><FiCheckCircle /></div>
          <div>
            <span className="lbl">Delivered Successfully</span>
            <h3>{shipments.filter((s) => s.status === "Delivered").length}</h3>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="shipping-controls">
        <div className="shp-search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Tracking No, Order, or Destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="shp-filter-tabs">
          {["All", "Preparing", "In Transit", "Out for Delivery", "Delivered"].map((st) => (
            <button
              key={st}
              type="button"
              className={`pill-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="shp-table-card">
        <div className="table-responsive">
          <table className="shp-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Order Ref</th>
                <th>Recipient</th>
                <th>Destination</th>
                <th>Courier Partner</th>
                <th>Tracking Number</th>
                <th>Delivery Status</th>
                <th style={{ textAlign: "right" }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shp) => (
                  <tr key={shp.shipmentId}>
                    <td style={{ fontWeight: 700 }}>{shp.shipmentId}</td>
                    <td style={{ color: "#2563eb", fontWeight: 600 }}>{shp.orderId}</td>
                    <td>{shp.customer}</td>
                    <td>
                      <span className="destination-text">
                        <FiMapPin className="pin-ico" /> {shp.destination}
                      </span>
                    </td>
                    <td>
                      <span className="courier-badge">{shp.courier}</span>
                    </td>
                    <td>
                      <code className="tracking-code">{shp.trackingNo}</code>
                    </td>
                    <td>
                      <span className={`shp-status-badge ${shp.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {shp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <select
                        className="shp-status-select"
                        value={shp.status}
                        onChange={(e) => handleUpdateStatus(shp.shipmentId, e.target.value)}
                      >
                        <option value="Preparing">Preparing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-results-cell">
                    No shipments match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Courier Dispatch</h3>
              <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateShipment} className="modal-form">
              <label>
                Order ID *
                <input
                  type="text"
                  placeholder="#ORD-9922"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </label>

              <label>
                Customer Name *
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
              </label>

              <label>
                Delivery Destination *
                <input
                  type="text"
                  placeholder="e.g. Dallas, TX, USA"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </label>

              <label>
                Select Courier
                <select value={courier} onChange={(e) => setCourier(e.target.value)}>
                  <option value="DHL Express">DHL Express</option>
                  <option value="FedEx">FedEx</option>
                  <option value="TCS Courier">TCS Courier</option>
                  <option value="Leopard Courier">Leopard Courier</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Generate Tracking & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}