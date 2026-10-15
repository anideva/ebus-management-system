import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function PassengerNavbar() {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isDarkMode = theme === "dark";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Passenger";

  return (
    <nav className="passenger-navbar">
      <Link to="/passenger/book" className="passenger-brand">
        <span className="passenger-brand-icon">🚌</span>
        <span>E-Bus Passenger</span>
      </Link>

      <ul className="passenger-nav-links">
        <li>
          <NavLink
            to="/passenger/book"
            className={({ isActive }) =>
              `passenger-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🎫</span>
            <span>Book Ticket</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/passenger/bookings"
            className={({ isActive }) =>
              `passenger-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>📋</span>
            <span>My Bookings</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/passenger/passes"
            className={({ isActive }) =>
              `passenger-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🪪</span>
            <span>My Passes</span>
          </NavLink>
        </li>
      </ul>

      <div className="passenger-nav-right">
        {role === "admin" && (
          <Link
            to="/dashboard"
            className="btn-admin-switch"
            title="Switch to transport administrator console"
          >
            🛠️ Admin Portal
          </Link>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            background: "var(--theme-toggle-bg)",
            color: "var(--theme-toggle-text)",
            border: "1px solid var(--theme-toggle-border)",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>{isDarkMode ? "☀️" : "🌙"}</span>
          <span style={{ fontSize: "12px" }}>
            {isDarkMode ? "Light" : "Dark"}
          </span>
        </button>

        <div className="passenger-user-info">
          <div className="passenger-avatar" title={user?.email || ""}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500 }}>{displayName}</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-nav-logout"
          title="Sign out of your account"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default PassengerNavbar;
