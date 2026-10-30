import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // HANDLE USER REGISTRATION
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setAuthError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Save trimmed name as the Firebase user's displayName
      await updateProfile(userCredential.user, {
        displayName: trimmedName,
      });

      setAuthSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setAuthError("This email address is already registered. Please sign in instead.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password is too weak. Please use at least 6 characters.");
      } else {
        setAuthError(error.message || "Failed to register account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = theme === "dark";

  return (
    <div className="auth-page">
      {/* THEME TOGGLE BUTTON */}
      <div className="auth-theme-toggle">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            background: "var(--theme-toggle-bg)",
            color: "var(--theme-toggle-text)",
            border: "1px solid var(--theme-toggle-border)",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{isDarkMode ? "☀️" : "🌙"}</span>
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* AUTH CARD */}
      <div className="auth-card">
        {/* BRAND HEADER */}
        <div className="auth-header">
          <div className="auth-brand">
            <span className="auth-brand-icon">🚍</span>
            <span>E-Bus Transit</span>
          </div>
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">
            Sign up as a commuter or student to book tickets and apply for transit passes
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {authError && (
          <div className="auth-alert auth-alert-error" role="alert">
            ⚠️ {authError}
          </div>
        )}

        {authSuccess && (
          <div className="auth-alert auth-alert-success" role="status">
            ✓ {authSuccess}
          </div>
        )}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="reg-name">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setAuthError("");
              }}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="reg-email">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthError("");
              }}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError("");
              }}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN FOOTER */}
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;