import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/sidebar.css";

function Sidebar() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="sidebar">
      <h2>E-Bus</h2>

      <nav>
        <Link to="/dashboard">🏠 Dashboard</Link>

        <Link to="/buses">🚌 Buses</Link>

         <Link to="/routes">🛣️ Route Management</Link>

        <Link to="/search">📍 Search Bus</Link>

        <Link to="/profile">👤 Profile</Link>

       

        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>
    </div>
  );
}

export default Sidebar;