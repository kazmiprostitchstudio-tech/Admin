import "./MetricCard.css";

export default function MetricCard({ title, value, change, isPositive, icon, color }) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <div className="metric-info">
          <span className="metric-title">{title}</span>
          <h3 className="metric-value">{value}</h3>
        </div>
        <div className="metric-icon-box" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
      </div>
      <div className="metric-footer">
        <span className={`metric-tag ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? `+${change}%` : `-${change}%`}
        </span>
        <span className="metric-subtext">vs last month</span>
      </div>
    </div>
  );
}