import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatCard from "../components/StatCard";
import RecentActivity from "../components/RecentActivity";

import { API_BASE_URL } from "../config/api";
import "../styles/dashboard.css";

function Dashboard() {
  // ===========================
  // STATES
  // ===========================
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [totalBuses, setTotalBuses] = useState(0);
  const [activeRoutes, setActiveRoutes] = useState(0);
  const [registeredStudents, setRegisteredStudents] = useState(0);
  const [activePasses, setActivePasses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);

  const [authLoading, setAuthLoading] = useState(true);

  // ===========================
  // FETCH DASHBOARD DATA
  // ===========================
  const fetchDashboardData = async (token) => {
    try {
      // FETCH BUSES
      const busesResponse = await fetch(`${API_BASE_URL}/api/buses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!busesResponse.ok) {
        throw new Error("Failed to fetch buses");
      }

      const buses = await busesResponse.json();
      setTotalBuses(buses.length);

      // FETCH ROUTES
      const routesResponse = await fetch(`${API_BASE_URL}/api/routes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!routesResponse.ok) {
        throw new Error("Failed to fetch routes");
      }

      const routes = await routesResponse.json();
      const activeRoutesCount = routes.filter(
        (route) => route.status === "Active"
      ).length;
      setActiveRoutes(activeRoutesCount);

      // FETCH STUDENTS
      const studentsResponse = await fetch(`${API_BASE_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!studentsResponse.ok) {
        throw new Error("Failed to fetch students");
      }

      const students = await studentsResponse.json();
      setRegisteredStudents(students.length);

      // FETCH PASSES
      const passesResponse = await fetch(`${API_BASE_URL}/api/passes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!passesResponse.ok) {
        throw new Error("Failed to fetch passes");
      }

      const passes = await passesResponse.json();
      const activePassesCount = passes.filter(
        (pass) => pass.status === "Active"
      ).length;
      setActivePasses(activePassesCount);

      // FETCH PAYMENTS
      const paymentsResponse = await fetch(`${API_BASE_URL}/api/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!paymentsResponse.ok) {
        throw new Error("Failed to fetch payments");
      }

      const payments = await paymentsResponse.json();
      const revenue = payments
        .filter((payment) => payment.status === "Paid")
        .reduce((total, payment) => total + Number(payment.amount), 0);
      setTotalRevenue(revenue);

      // FETCH TICKETS
      const ticketsResponse = await fetch(`${API_BASE_URL}/api/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ticketsResponse.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const tickets = await ticketsResponse.json();
      setTotalTickets(tickets.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // ===========================
  // FIREBASE AUTHENTICATION
  // ===========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthLoading(false);
        navigate("/login");
        return;
      }

      // Store logged-in user's displayName (Firebase displayName)
      setDisplayName(user.displayName || "");

      try {
        // GET FIREBASE ID TOKEN
        const token = await user.getIdToken();

        // FETCH DASHBOARD DATA
        await fetchDashboardData(token);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ===========================
  // HANDLE SAVE NAME (FOR USERS MISSING DISPLAY NAME)
  // ===========================
  const handleSaveName = async (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      alert("Please enter your name.");
      return;
    }

    if (!auth.currentUser) return;

    try {
      setSavingName(true);
      await updateProfile(auth.currentUser, {
        displayName: trimmed,
      });

      // Update local state immediately so UI refreshes without re-login
      setDisplayName(trimmed);
      setNameInput("");

      // Notify Navbar and any other listening components
      window.dispatchEvent(new Event("user-profile-updated"));
    } catch (error) {
      console.error("Failed to update profile name:", error);
      alert("Failed to save name. Please try again.");
    } finally {
      setSavingName(false);
    }
  };

  // ===========================
  // LOADING SCREEN
  // ===========================
  if (authLoading) {
    return (
      <div className="dashboard">
        <div className="main-content">
          <div className="loading-container">
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // JSX
  // ===========================
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar userName={displayName} />

        <WelcomeSection userName={displayName} />

        {/* ====================================================
            PERSONALIZED NAME PROMPT (FOR EXISTING ACCOUNTS)
        ==================================================== */}
        {!displayName && (
          <div className="name-prompt-card">
            <div className="name-prompt-content">
              <div className="name-prompt-icon" aria-hidden="true">👤</div>
              <div>
                <h3>Personalize Your Experience</h3>
                <p>
                  You haven't set a display name yet. Enter your name below to personalize your greeting.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveName} className="name-prompt-form">
              <input
                type="text"
                placeholder="Enter your name (e.g., Aniketh)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
              <button type="submit" disabled={savingName || !nameInput.trim()}>
                {savingName ? "Saving..." : "Save Name"}
              </button>
            </form>
          </div>
        )}

        {/* ===========================
            DASHBOARD STAT CARDS
        =========================== */}
        <div className="cards">
          <StatCard
            title="Total Buses"
            value={totalBuses}
            icon="🚌"
          />

          <StatCard
            title="Active Routes"
            value={activeRoutes}
            icon="📍"
          />

          <StatCard
            title="Registered Students"
            value={registeredStudents}
            icon="🎓"
          />

          <StatCard
            title="Active Passes"
            value={activePasses}
            icon="🎫"
          />

          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue}`}
            icon="💰"
          />

          <StatCard
            title="Total Tickets"
            value={totalTickets}
            icon="🎟️"
          />
        </div>

        {/* ===========================
            RECENT ACTIVITY
        =========================== */}
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;