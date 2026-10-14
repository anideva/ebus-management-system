import "../styles/navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";


function Navbar({ userEmail }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };
  return (
    <header className="navbar">
      <div className="logo">
        🚌 E-Bus Management System
      </div>

     <div className="user-info">
  <span>Welcome, {userEmail}</span>

  <div className="avatar">👤</div>

  <button onClick={handleLogout}>
    Logout
  </button>
</div>
    </header>
  );
}

export default Navbar;