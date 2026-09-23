import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import Overview from "./components/Overview/Overview";
import Products from "./components/Products/Products";
import Orders from "./components/Orders/Orders";
import Customers from "./components/Customers/Customers";
import Categories from "./components/Categories/Categories"; // Imported
import Coupons from "./components/Coupons/Coupons";       // Imported
import PlaceholderPage from "./components/pages/PlaceholderPage";
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
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/payments" element={<PlaceholderPage title="Payments & Gateways" description="Track Stripe, PayPal, COD payouts, and payment statuses." />} />
                <Route path="/shipping" element={<PlaceholderPage title="Shipping & Logistics" description="Manage couriers, delivery zones, rates, and tracking numbers." />} />
                <Route path="/analytics" element={<PlaceholderPage title="Reports & Deep Analytics" description="Detailed sales conversion, cart abandonment, and customer LTV." />} />
                <Route path="/reviews" element={<PlaceholderPage title="Reviews & Ratings" description="Moderate customer feedback, approve ratings, and manage replies." />} />
                <Route path="/notifications" element={<PlaceholderPage title="System Notifications" description="Low stock warnings, server status, and order alerts." />} />
                <Route path="/admins" element={<PlaceholderPage title="Admin Users & Roles" description="Control staff access, role-based permissions, and audit logs." />} />
                <Route path="/settings" element={<PlaceholderPage title="Store Settings" description="General store configuration, currencies, tax rules, and email templates." />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AdminProvider>
  );
}