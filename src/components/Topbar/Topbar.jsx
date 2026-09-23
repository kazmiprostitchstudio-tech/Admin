import { FiSearch, FiBell, FiMenu, FiLogOut } from "react-icons/fi";
import "./Topbar.css";

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} type="button">
          <FiMenu />
        </button>
        <div className="topbar-search">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search orders, products, customers..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" type="button" aria-label="Notifications">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser" alt="Admin" />
          <div className="user-details">
            <span className="user-name">Syed Hassan Kazmi</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>

        <button className="logout-btn" title="Logout" type="button">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}