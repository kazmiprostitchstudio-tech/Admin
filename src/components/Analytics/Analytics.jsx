import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiUsers } from "react-icons/fi";
import "./Analytics.css";

const MONTHLY_COMPARISON = [
  { month: "Jan", sales2025: 4200, sales2026: 5800 },
  { month: "Feb", sales2025: 5100, sales2026: 7200 },
  { month: "Mar", sales2025: 6800, sales2026: 9400 },
  { month: "Apr", sales2025: 7400, sales2026: 8900 },
  { month: "May", sales2025: 8900, sales2026: 12100 },
  { month: "Jun", sales2025: 10500, sales2026: 15400 },
  { month: "Jul", sales2025: 12200, sales2026: 18200 },
];

const CATEGORY_SHARE = [
  { name: "T-shirts", value: 38, color: "#3b82f6" },
  { name: "Shirts", value: 26, color: "#10b981" },
  { name: "Jeans", value: 20, color: "#f59e0b" },
  { name: "Shorts", value: 16, color: "#8b5cf6" },
];

const CHANNEL_PERFORMANCE = [
  { channel: "Direct Web", visitors: 18400, orders: 840, conversion: "4.56%" },
  { channel: "Google Search", visitors: 26200, orders: 1120, conversion: "4.27%" },
  { channel: "Instagram Shop", visitors: 34100, orders: 1980, conversion: "5.80%" },
  { channel: "Email Campaigns", visitors: 8200, orders: 540, conversion: "6.58%" },
];

export default function Analytics() {
  return (
    <div className="analytics-module">
      <div className="module-top-header">
        <div>
          <h2>Performance & Business Intelligence</h2>
          <p>Multi-channel sales performance, conversion funnels, and revenue attribution.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="analytics-kpi-grid">
        <div className="kpi-box">
          <span className="lbl">Annual Revenue Run-Rate</span>
          <h3>$218,400.00</h3>
          <span className="growth-tag positive">+24.8% YoY</span>
        </div>
        <div className="kpi-box">
          <span className="lbl">Average Order Value (AOV)</span>
          <h3>$142.50</h3>
          <span className="growth-tag positive">+5.2% vs last month</span>
        </div>
        <div className="kpi-box">
          <span className="lbl">Store Conversion Rate</span>
          <h3>4.82%</h3>
          <span className="growth-tag positive">+0.4% baseline</span>
        </div>
        <div className="kpi-box">
          <span className="lbl">Cart Abandonment Rate</span>
          <h3>28.4%</h3>
          <span className="growth-tag negative">-3.1% improved</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Year-over-Year Growth */}
        <div className="chart-card-box large">
          <div className="chart-title-bar">
            <h3>Revenue Growth YoY (2025 vs 2026)</h3>
            <span className="badge">USD ($)</span>
          </div>
          <div className="chart-inner-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={MONTHLY_COMPARISON}>
                <defs>
                  <linearGradient id="color2026" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sales2026" name="2026 Revenue" stroke="#0f172a" strokeWidth={2.5} fill="url(#color2026)" />
                <Area type="monotone" dataKey="sales2025" name="2025 Revenue" stroke="#94a3b8" strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie */}
        <div className="chart-card-box">
          <div className="chart-title-bar">
            <h3>Sales by Category</h3>
            <span className="badge">Volume Share</span>
          </div>
          <div className="chart-inner-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Attribution Table */}
      <div className="analytics-table-card">
        <div className="table-header">
          <h3>Channel Acquisition & Conversion Funnel</h3>
        </div>
        <div className="table-responsive">
          <table className="channel-table">
            <thead>
              <tr>
                <th>Traffic Acquisition Channel</th>
                <th>Unique Visitors</th>
                <th>Orders Converted</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {CHANNEL_PERFORMANCE.map((ch) => (
                <tr key={ch.channel}>
                  <td style={{ fontWeight: 600 }}>{ch.channel}</td>
                  <td>{ch.visitors.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{ch.orders.toLocaleString()}</td>
                  <td>
                    <span className="conv-pill">{ch.conversion}</span>
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