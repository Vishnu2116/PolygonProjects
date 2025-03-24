import emblemlogo from "../assets/emblemLogo.svg";
import "../styles/Navbar.css"; // CSS is applied globally

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function Navbar({ onLogout }) {
  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="APlogo">
          <img src={emblemlogo} alt="" />
        </div>
        <div className="andr">
          <h1>Land Information System</h1>
          <h4 align="center">Andhra Pradesh</h4>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
