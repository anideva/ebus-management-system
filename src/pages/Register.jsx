import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // HANDLE USER REGISTRATION
  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save trimmed name as the Firebase user's displayName
      await updateProfile(userCredential.user, {
        displayName: trimmedName,
      });

      alert("User Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = theme === "dark";

  // REGISTER PAGE UI
  return (
    <div>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
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
            width: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{isDarkMode ? "☀️" : "🌙"}</span>
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      <div className="container">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;