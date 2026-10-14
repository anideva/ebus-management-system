import "../styles/welcome.css";

function WelcomeSection({ userName }) {
  const greeting = userName && userName.trim()
    ? `👋 Welcome, ${userName.trim()}!`
    : "👋 Welcome!";

  return (
    <div className="welcome-section">
      <h1>{greeting}</h1>
      <p>
        Manage buses, routes, and bookings from one place. Have a productive day! 🚌
      </p>
    </div>
  );
}

export default WelcomeSection;