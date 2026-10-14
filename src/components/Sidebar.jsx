import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sidebarRef = useRef(null);

  // Sync mobile drawer events from Navbar
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

  // Update .sidebar-expanded class on .dashboard container to keep main-content in exact lockstep
  const updateDashboardClass = (expanded) => {
    if (window.innerWidth > 900) {
      const dashboard = document.querySelector(".dashboard");
      if (dashboard) {
        if (expanded) {
          dashboard.classList.add("sidebar-expanded");
        } else {
          dashboard.classList.remove("sidebar-expanded");
        }
      }
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth > 900) {
      setIsHovered(true);
      updateDashboardClass(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 900) {
      setIsHovered(false);
      updateDashboardClass(false);
    }
  };

  // Keyboard accessibility: expand on focus, collapse on blur
  const handleFocus = () => {
    if (window.innerWidth > 900) {
      setIsHovered(true);
      updateDashboardClass(true);
    }
  };

  const handleBlur = (e) => {
    if (window.innerWidth > 900 && sidebarRef.current) {
      // Collapse only if new focus target is outside the sidebar
      if (!sidebarRef.current.contains(e.relatedTarget)) {
        setIsHovered(false);
        updateDashboardClass(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsHovered(false);
      updateDashboardClass(false);
      if (mobileOpen) setMobileOpen(false);
    }
  };

  const closeSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        className={`sidebar ${mobileOpen ? "open" : ""} ${isHovered ? "expanded" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Main Navigation"
      >
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
            aria-label="Dashboard"
          >
            <span className="nav-icon" aria-hidden="true">📊</span>
            <span className="nav-label">Dashboard</span>
            <span className="nav-tooltip" role="tooltip">Dashboard</span>
          </NavLink>

          <NavLink
            to="/buses"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Buses"
          >
            <span className="nav-icon" aria-hidden="true">🚌</span>
            <span className="nav-label">Buses</span>
            <span className="nav-tooltip" role="tooltip">Buses</span>
          </NavLink>

          <NavLink
            to="/routes"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Routes"
          >
            <span className="nav-icon" aria-hidden="true">🛣️</span>
            <span className="nav-label">Routes</span>
            <span className="nav-tooltip" role="tooltip">Routes</span>
          </NavLink>

          <NavLink
            to="/student-management"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Students"
          >
            <span className="nav-icon" aria-hidden="true">🎓</span>
            <span className="nav-label">Students</span>
            <span className="nav-tooltip" role="tooltip">Students</span>
          </NavLink>

          <NavLink
            to="/ticket-management"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Tickets"
          >
            <span className="nav-icon" aria-hidden="true">🎟️</span>
            <span className="nav-label">Tickets</span>
            <span className="nav-tooltip" role="tooltip">Tickets</span>
          </NavLink>

          <NavLink
            to="/payment-management"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Payments"
          >
            <span className="nav-icon" aria-hidden="true">💳</span>
            <span className="nav-label">Payments</span>
            <span className="nav-tooltip" role="tooltip">Payments</span>
          </NavLink>

          <NavLink
            to="/drivers"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Drivers"
          >
            <span className="nav-icon" aria-hidden="true">👨‍✈️</span>
            <span className="nav-label">Drivers</span>
            <span className="nav-tooltip" role="tooltip">Drivers</span>
          </NavLink>

          <NavLink
            to="/passes"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            aria-label="Passes"
          >
            <span className="nav-icon" aria-hidden="true">🎫</span>
            <span className="nav-label">Passes</span>
            <span className="nav-tooltip" role="tooltip">Passes</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;