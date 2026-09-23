import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import Overview from "./components/Overview/Overview";
import Products from "./components/Products/Products";
import Orders from "./components/Orders/Orders";
import Customers from "./components/Customers/Customers";
import Categories from "./components/Categories/Categories";
import Coupons from "./components/Coupons/Coupons";
import Reviews from "./components/Reviews/Reviews";
import Payments from "./components/Payments/Payments";
import Shipping from "./components/Shipping/Shipping";
import Analytics from "./components/Analytics/Analytics";
import Notifications from "./components/Notifications/Notifications";
import Admins from "./components/Admins/Admins";
import Settings from "./components/Settings/Settings";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminProvider>
      <Router>
        <div className="admin-layout">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="admin-main-wrapper">
            <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <main className="admin-content-area">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AdminProvider>
  );
}