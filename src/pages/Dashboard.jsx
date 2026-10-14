import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
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

  const [userEmail, setUserEmail] = useState("");

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

      // Store logged-in user's email
      setUserEmail(user.email);

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
  // LOADING SCREEN
  // ===========================

  if (authLoading) {

    return (
      <div className="dashboard">

        <div className="main-content">

          <h2>
            Loading Dashboard...
          </h2>

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

        <Navbar
          userEmail={userEmail}
        />


        <WelcomeSection
          userEmail={userEmail}
        />


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