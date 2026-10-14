import "../styles/welcome.css";

function WelcomeSection({ userName }) {
  const greeting = userName && userName.trim()
    ? `Welcome back, ${userName.trim()}!`
    : "Welcome back!";

  return (
    <div className="welcome-section">
      <h1 className="welcome-title">{greeting}</h1>
      <p className="welcome-subtitle">
        Here is what's happening across your fleet today.
      </p>
    </div>
  );
}

export default WelcomeSection;