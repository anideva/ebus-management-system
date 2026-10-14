import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    window.addEventListener("close-mobile-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
      window.removeEventListener("close-mobile-sidebar", handleClose);
    };
  }, []);

  const closeSidebar = () => {
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeSidebar();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <span className="brand-icon" aria-hidden="true">🚌</span>
          <span className="brand-text">E-Bus Fleet</span>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">📊</span>
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/buses"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">🚌</span>
            <span className="nav-label">Buses</span>
          </NavLink>

          <NavLink
            to="/routes"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">🛣️</span>
            <span className="nav-label">Routes</span>
          </NavLink>

          <NavLink
            to="/student-management"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">🎓</span>
            <span className="nav-label">Students</span>
          </NavLink>

          <NavLink
            to="/ticket-management"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">🎟️</span>
            <span className="nav-label">Tickets</span>
          </NavLink>

          <NavLink
            to="/payment-management"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">💳</span>
            <span className="nav-label">Payments</span>
          </NavLink>

          <NavLink
            to="/drivers"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">👨‍✈️</span>
            <span className="nav-label">Drivers</span>
          </NavLink>

          <NavLink
            to="/passes"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon" aria-hidden="true">🎫</span>
            <span className="nav-label">Passes</span>
          </NavLink>
        </nav>

        {/* Bottom Logout */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <span aria-hidden="true">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;