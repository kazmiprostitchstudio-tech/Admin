import { useState } from "react";
import { FiSearch, FiEye, FiTrash2, FiClock, FiCheckCircle, FiTruck, FiX } from "react-icons/fi";
import { useAdmin } from "../../context/AdminContext";
import "./Orders.css";

export default function Orders() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewingOrder, setViewingOrder] = useState(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-module">
      <div className="module-top-header">
        <div>
          <h2>Orders Management</h2>
          <p>Update live shipping status, manage transactions, and track order fulfillment.</p>
        </div>
      </div>

      {/* Control Filters */}
      <div className="orders-control-bar">
        <div className="order-search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="order-status-tabs">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((st) => (
            <button
              key={st}
              type="button"
              className={`tab-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-card">
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Purchased Items</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Status (Live Switcher)</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: 700 }}>{ord.id}</td>
                    <td>
                      <div className="customer-info-cell">
                        <span className="name">{ord.customer}</span>
                        <span className="email">{ord.email}</span>
                      </div>
                    </td>
                    <td><span className="items-text">{ord.items}</span></td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>${ord.amount}</td>
                    <td>
                      <span className={`payment-badge ${ord.paymentStatus.toLowerCase()}`}>
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td>
                      {/* Live Status Selector */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`status-select-dropdown ${ord.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.825rem" }}>{ord.date}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="order-action-btns">
                        <button
                          type="button"
                          className="btn-action view"
                          title="View Invoice / Details"
                          onClick={() => setViewingOrder(ord)}
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="btn-action delete"
                          title="Delete Order"
                          onClick={() => {
                            if (window.confirm(`Cancel and delete order ${ord.id}?`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    No orders found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="modal-backdrop" onClick={() => setViewingOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Receipt: {viewingOrder.id}</h3>
              <button type="button" className="close-modal-btn" onClick={() => setViewingOrder(null)}>
                <FiX />
              </button>
            </div>

            <div className="order-receipt-content">
              <div className="receipt-row">
                <span className="lbl">Customer Name</span>
                <span className="val">{viewingOrder.customer}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Email</span>
                <span className="val">{viewingOrder.email}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Item Summary</span>
                <span className="val">{viewingOrder.items}</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Payment Method</span>
                <span className="val">{viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})</span>
              </div>
              <div className="receipt-row">
                <span className="lbl">Fulfillment Status</span>
                <span className={`status-pill ${viewingOrder.status.toLowerCase()}`}>{viewingOrder.status}</span>
              </div>
              <div className="receipt-total-row">
                <span>Grand Total</span>
                <h3>${viewingOrder.amount}.00</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}