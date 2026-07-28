import "../styles/statcard.css";


function StatCard({ title, value, icon }) {
  return (
    <div className="card">
      <h2>
        <span className="card-icon">{icon}</span> {title}
      </h2>

      <p>{value}</p>
    </div>
  );
}

export default StatCard;