import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
  // ROLE TAB STATE: 'passenger' (default) or 'admin'
  const [activeTab, setActiveTab] = useState("passenger");

  // FORM & FEEDBACK STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, role, refreshRole } = useAuth();
  const isDarkMode = theme === "dark";

  // Redirect if already authenticated
  useEffect(() => {
    if (user && role) {
      navigate(role === "admin" ? "/dashboard" : "/passenger/book", { replace: true });
    }
  }, [user, role, navigate]);

  // Tab switch handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setAuthError("");
    setAuthSuccess("");
  };

  // Autofill demo credentials for instant live presentations
  const handleAutofillDemo = () => {
    setAuthError("");
    if (activeTab === "passenger") {
      setEmail("passenger.demo@ebus.com");
      setPassword("password123");
      setAuthSuccess("Autofilled Demo Passenger credentials. Click Sign In below!");
    } else {
      setEmail("admin.demo@ebus.com");
      setPassword("password123");
      setAuthSuccess("Autofilled Demo Admin credentials. Click Sign In below!");
    }
  };

  // HANDLE USER EMAIL/PASSWORD LOGIN
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      const userRole = await refreshRole();
      navigate(userRole === "admin" ? "/dashboard" : "/passenger/book");
    } catch (error) {
      console.error("Firebase Login Error:", error);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setAuthError(
          "Invalid email or password. If this demo account is not registered in your Firebase project yet, click 'Register' below to create it."
        );
      } else {
        setAuthError(error.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // HANDLE GOOGLE SIGN-IN
  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthSuccess("");

    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      const userRole = await refreshRole();
      navigate(userRole === "admin" ? "/dashboard" : "/passenger/book");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        return;
      }
      if (
        error.code === "auth/configuration-not-found" ||
        error.code === "auth/operation-not-allowed"
      ) {
        setAuthError(
          "Google Sign-In is not enabled yet in your Firebase Console. Please enable Google under Authentication > Sign-in method."
        );
        return;
      }
      setAuthError(error.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="auth-title">
            {activeTab === "passenger" ? "Passenger & Student Portal" : "Transport Admin Console"}
          </h2>
          <p className="auth-subtitle">
            {activeTab === "passenger"
              ? "Book transit tickets, choose seats & manage commuter passes"
              : "Fleet operations, route management & revenue tracking"}
          </p>
        </div>

        {/* ROLE SELECTOR TABS */}
        <div className="role-tabs" role="tablist" aria-label="Portal Role Selector">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "passenger"}
            className={`role-tab ${activeTab === "passenger" ? "active" : ""}`}
            onClick={() => handleTabSwitch("passenger")}
          >
            <span className="role-tab-icon">👤</span>
            <span>Passenger / Student</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "admin"}
            className={`role-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => handleTabSwitch("admin")}
          >
            <span className="role-tab-icon">🛡️</span>
            <span>Transport Admin</span>
          </button>
        </div>

        {/* ROLE INFO BANNER */}
        <div className="role-info-banner">
          <span>{activeTab === "passenger" ? "🎫" : "⚙️"}</span>
          <span>
            {activeTab === "passenger"
              ? "Commuter Portal: Search active routes, pick visual bus seats, and apply for student passes."
              : "Administrative Console: Manage bus fleet, design transit routes with stops, and review finances."}
          </span>
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

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="auth-email">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              placeholder={
                activeTab === "passenger" ? "passenger@example.com" : "admin@ebus.com"
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthError("");
              }}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError("");
              }}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Signing in..."
              : activeTab === "passenger"
              ? "Sign In as Passenger"
              : "Sign In as Admin"}
          </button>
        </form>

        {/* QUICK DEMO CREDENTIALS BOX */}
        <div className="quick-demo-card">
          <div className="quick-demo-top">
            <span className="quick-demo-badge">Presentation Mode</span>
            <span className="quick-demo-hint">One-click showcase</span>
          </div>
          <button
            type="button"
            className="quick-demo-action"
            onClick={handleAutofillDemo}
            title={`Fill ${activeTab === "passenger" ? "Passenger" : "Admin"} sample credentials`}
          >
            <span>⚡</span>
            <span>
              Autofill Demo {activeTab === "passenger" ? "Passenger" : "Admin"} Account
            </span>
          </button>
        </div>

        {/* DIVIDER */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* GOOGLE SIGN IN */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* REGISTER FOOTER */}
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;