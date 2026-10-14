import "../styles/statcard.css";

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-icon" aria-hidden="true">{icon}</span>
      </div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
}

export default StatCard;