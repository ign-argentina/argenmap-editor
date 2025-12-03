import "./MetricCard.css";

function MetricCard({ icon, title, value }) {
  return (
    <div className="metric-card">
      <div className="metric-card-icon">{icon}</div>
      <div className="metric-card-value">{value}</div>
      <div className="metric-card-title">{title}</div>
    </div>
  );
}

export default MetricCard;
