import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatCard from "../components/StatCard";
import RecentActivity from "../components/RecentActivity";


function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/login");
    } else {
      setUserEmail(user.email);
    }
  });

  return () => unsubscribe();
}, [navigate]);

  

 return (
  <div className="dashboard">
    <Sidebar />

    <div className="main-content">
      <Navbar userEmail={userEmail} />

      <WelcomeSection userEmail={userEmail} />

      <div className="cards">
  <StatCard
    title="Total Buses"
    value="0"
    icon="🚌"
  />

  <StatCard
    title="Active Routes"
    value="0"
    icon="📍"
  />

  <StatCard
    title="Registered Users"
    value="0"
    icon="👥"
  />
</div>
  <RecentActivity />
    </div>
    



</div>
 
);
}

export default Dashboard;