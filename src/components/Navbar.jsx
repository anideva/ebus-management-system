import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/navbar.css";

function Navbar({ userName }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [authDisplayName, setAuthDisplayName] = useState(
    auth.currentUser?.displayName || ""
  );

  // Sync with Firebase Auth state and custom profile update events
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthDisplayName(user?.displayName || "");
    });

    const handleProfileUpdate = () => {
      setAuthDisplayName(auth.currentUser?.displayName || "");
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
    };
  }, []);

  // Idiomatic React: derive display name directly from props or auth state
  const displayName = userName !== undefined && userName !== ""
    ? userName
    : authDisplayName;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const isDarkMode = theme === "dark";
  const avatarInitial = displayName && displayName.trim()
    ? displayName.trim().charAt(0).toUpperCase()
    : "👤";

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => window.dispatchEvent(new Event("toggle-mobile-sidebar"))}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className="logo">
          <span className="logo-icon" aria-hidden="true">🚌</span>
          <span className="logo-text">E-Bus Management System</span>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Passenger Portal Switch Link */}
        <Link
          to="/passenger/book"
          style={{
            padding: "6px 12px",
            fontSize: "0.82rem",
            fontWeight: 500,
            color: "var(--primary)",
            backgroundColor: "var(--primary-light)",
            borderRadius: "6px",
            textDecoration: "none",
            border: "1px solid var(--border-color)",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
          title="Open Passenger Booking Portal"
        >
          🎫 Passenger Portal
        </Link>

        {/* Compact Theme Toggle */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="theme-icon" aria-hidden="true">{isDarkMode ? "☀️" : "🌙"}</span>
          <span className="theme-label">{isDarkMode ? "Light" : "Dark"}</span>
        </button>

        {/* User Profile (Avatar + Name) */}
        <div className="user-profile">
          <div className="avatar" aria-hidden="true">
            {avatarInitial}
          </div>
          <span className="user-name" title={displayName || undefined}>
            {displayName || "User"}
          </span>
        </div>

        {/* Logout Action */}
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;