import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
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
  const userGreeting = displayName ? `Welcome, ${displayName}` : "Welcome!";
  const avatarInitial = displayName ? displayName.trim().charAt(0).toUpperCase() : "👤";

  return (
    <header className="navbar">
      <div className="logo">
        🚌 E-Bus Management System
      </div>

      <div className="navbar-actions">
        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="theme-icon">{isDarkMode ? "☀️" : "🌙"}</span>
          <span className="theme-label">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <div className="user-info">
          <span className="user-greeting" title={displayName || undefined}>
            {userGreeting}
          </span>

          <div className="avatar" aria-hidden="true">
            {avatarInitial}
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;