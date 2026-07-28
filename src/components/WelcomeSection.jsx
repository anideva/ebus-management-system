import "../styles/welcome.css";

function WelcomeSection({ userEmail }) {
  return (
    <div className="welcome-section">
      <h1>👋 Welcome Back!</h1>

      <h2>{userEmail}</h2>

      <p>
        Manage buses, routes, and bookings from one place.
        Have a productive day! 🚌
      </p>
    </div>
  );
}

export default WelcomeSection;