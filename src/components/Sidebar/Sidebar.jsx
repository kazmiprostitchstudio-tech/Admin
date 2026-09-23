import { NavLink } from "react-router-dom";
import { 
  FiHome, 
  FiShoppingBag, 
  FiBox, 
  FiGrid, 
  FiUsers, 
  FiCreditCard, 
  FiTruck, 
  FiPercent, 
  FiBarChart2, 
  FiStar, 
  FiBell, 
  FiShield, 
  FiSettings 
} from "react-icons/fi";
import "./Sidebar.css";

const NAVIGATION_ITEMS = [
  { label: "Overview", path: "/", icon: <FiHome /> },
  { label: "Orders", path: "/orders", icon: <FiShoppingBag />, badge: "12" },
  { label: "Products", path: "/products", icon: <FiBox /> },
  { label: "Categories & Brands", path: "/categories", icon: <FiGrid /> },
  { label: "Customers", path: "/customers", icon: <FiUsers /> },
  { label: "Payments", path: "/payments", icon: <FiCreditCard /> },
  { label: "Shipping", path: "/shipping", icon: <FiTruck /> },
  { label: "Coupons & Discounts", path: "/coupons", icon: <FiPercent /> },
  { label: "Analytics & Reports", path: "/analytics", icon: <FiBarChart2 /> },
  { label: "Reviews & Ratings", path: "/reviews", icon: <FiStar /> },
  { label: "Notifications", path: "/notifications", icon: <FiBell />, badge: "5" },
  { label: "Permissions & Admins", path: "/admins", icon: <FiShield /> },
  { label: "Settings", path: "/settings", icon: <FiSettings /> },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <h2>SHOP.CO</h2>
        <span className="brand-badge">Admin</span>
      </div>

      <nav className="sidebar-nav">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}