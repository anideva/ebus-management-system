import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>E-Bus</h2>

      <nav>
        <Link to="/dashboard">🏠 Dashboard</Link>

        <Link to="/buses">🚌 Buses</Link>

        <Link to="/routes">🛣️ Route Management</Link>

        <Link to="/student-management">🎓 Student Management</Link>

        <Link to="/ticket-management">🎟️ Ticket Management</Link>

        <Link to="/payment-management">💳 Payment Management</Link>

        <Link to="/drivers">👨‍✈️ Driver Management</Link>

        <Link to="/passes">🎫 Pass Management</Link>

        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>
    </div>
  );
}

export default Sidebar;