import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";


function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserEmail(user.email); // ✅ get user email
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

 return (
  <div className="dashboard">
    <Sidebar />

    <div className="main-content">
        <Navbar userEmail={userEmail} />

      <h1>Dashboard</h1>

      <h3>Welcome, {userEmail}</h3>

      <div className="cards">
        <div className="card">
          <h2>Total Buses</h2>
          <p>0</p>
        </div>

        <div className="card">
          <h2>Active Routes</h2>
          <p>0</p>
        </div>

        <div className="card">
          <h2>Registered Users</h2>
          <p>0</p>
        </div>

  
      </div>
    </div>
  </div>
);
}

export default Dashboard;