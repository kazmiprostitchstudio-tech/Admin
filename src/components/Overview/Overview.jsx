import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { FiDollarSign, FiShoppingBag, FiBox, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import MetricCard from "../MetricCard/MetricCard";
import "./Overview.css";

const REVENUE_CHART_DATA = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 6100 },
  { month: "Mar", revenue: 7800 },
  { month: "Apr", revenue: 7100 },
  { month: "May", revenue: 9500 },
  { month: "Jun", revenue: 11400 },
  { month: "Jul", revenue: 14200 },
];

const WEEKLY_SALES_DATA = [
  { day: "Mon", orders: 45 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 38 },
  { day: "Thu", orders: 65 },
  { day: "Fri", orders: 85 },
  { day: "Sat", orders: 110 },
  { day: "Sun", orders: 95 },
];

export default function Overview() {
  const { totalRevenue, totalOrdersCount, pendingOrdersCount, totalStockUnits, orders } = useAdmin();

  return (
    <div className="overview-page">
      <div className="page-header">
        <div>
          <h2>Executive Store Overview</h2>
          <p>Real-time analytics and financial breakdown automatically synced with LocalStorage.</p>
        </div>
        <Link to="/products" className="primary-action-btn">+ Manage Products</Link>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Gross Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="18.2"
          isPositive={true}
          icon={<FiDollarSign />}
          color="#3b82f6"
        />
        <MetricCard
          title="Total Orders Recorded"
          value={totalOrdersCount}
          change="12.5"
          isPositive={true}
          icon={<FiShoppingBag />}
          color="#10b981"
        />
        <MetricCard
          title="Pending Fulfillment"
          value={pendingOrdersCount}
          change="4.1"
          isPositive={false}
          icon={<FiClock />}
          color="#f59e0b"
        />
        <MetricCard
          title="Total Inventory Units"
          value={totalStockUnits}
          change="6.8"
          isPositive={true}
          icon={<FiBox />}
          color="#8b5cf6"
        />
      </div>

      {/* Dynamic Recharts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Projection ($)</h3>
            <span className="chart-badge">Monthly Growth</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={REVENUE_CHART_DATA}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Orders Activity</h3>
            <span className="chart-badge">Last 7 Days</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={WEEKLY_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="orders" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Synced Orders Table */}
      <div className="table-card">
        <div className="table-card-header">
          <h3>Recent Transactions</h3>
          <Link to="/orders" className="view-all-link">Go to Orders Module &rarr;</Link>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Purchased Item</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 600 }}>{ord.id}</td>
                  <td>{ord.customer}</td>
                  <td>{ord.items}</td>
                  <td style={{ fontWeight: 700 }}>${ord.amount}</td>
                  <td>
                    <span className={`status-pill ${ord.status.toLowerCase()}`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}