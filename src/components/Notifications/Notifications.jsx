import { useState, useEffect } from "react";
import { 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiInfo, 
  FiShoppingBag, 
  FiTrash2, 
  FiCheck 
} from "react-icons/fi";
import "./Notifications.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-1",
    type: "warning",
    title: "Low Inventory Warning",
    message: "Black Striped T-shirt is down to 5 units in stock. Reorder suggested.",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "NOTIF-2",
    type: "order",
    title: "High Value Order Received",
    message: "Samantha D. placed an order worth $845.00 (#ORD-9921).",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "NOTIF-3",
    type: "success",
    title: "Courier Dispatch Completed",
    message: "Tracking DHL-98214309 was picked up by DHL Express.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "NOTIF-4",
    type: "info",
    title: "System Backup Created",
    message: "Store catalog and customer records auto-synced with LocalStorage.",
    time: "Yesterday",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_notifs");
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopco_admin_notifs", JSON.stringify(notifications));
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Clear all notification alerts?")) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-module">
      <div className="module-top-header">
        <div>
          <h2>System Activity & Alerts</h2>
          <p>Real-time order pings, stock threshold alerts, and logistical tracking updates.</p>
        </div>
        <div className="notif-actions">
          {unreadCount > 0 && (
            <button type="button" className="btn-mark-read" onClick={markAllAsRead}>
              <FiCheck /> Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button type="button" className="btn-clear-all" onClick={clearAll}>
              <FiTrash2 /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="notifications-container">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className={`notif-card ${!n.read ? "unread" : ""}`}>
              <div className={`notif-icon ${n.type}`}>
                {n.type === "warning" && <FiAlertTriangle />}
                {n.type === "order" && <FiShoppingBag />}
                {n.type === "success" && <FiCheckCircle />}
                {n.type === "info" && <FiInfo />}
              </div>

              <div className="notif-content">
                <div className="notif-header">
                  <h4>{n.title}</h4>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p>{n.message}</p>
              </div>

              <button
                type="button"
                className="btn-del-notif"
                onClick={() => deleteNotification(n.id)}
                title="Dismiss"
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <div className="empty-notif-box">
            <FiCheckCircle className="done-ico" />
            <h3>All caught up!</h3>
            <p>There are no active alerts or pending warnings.</p>
          </div>
        )}
      </div>
    </div>
  );
}