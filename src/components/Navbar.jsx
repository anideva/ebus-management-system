import "../styles/navbar.css";

function Navbar({ userEmail }) {
  return (
    <header className="navbar">
      <div className="logo">
        🚌 E-Bus Management System
      </div>

      <div className="user-info">
        <span>Welcome, {userEmail}</span>
        <div className="avatar">👤</div>
      </div>
    </header>
  );
}

export default Navbar;