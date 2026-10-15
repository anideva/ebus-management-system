import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route wrapper that ensures authentication and role authorization.
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g. ['admin'], ['passenger', 'admin'])
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--bg-app)",
          color: "var(--text-secondary)",
          fontSize: "16px",
          fontFamily: "inherit",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          Loading your session...
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = role || "passenger";
    if (!allowedRoles.includes(userRole)) {
      // If user is a passenger trying to access admin dashboard, redirect to passenger portal
      if (userRole === "passenger") {
        return <Navigate to="/passenger/book" replace />;
      }
      // If admin trying to access something forbidden (rare), send to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
