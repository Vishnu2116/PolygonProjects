import emblemlogo from "../assets/emblemLogo.svg";
import "../styles/Navbar.css";

export default function Navbar({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Clear token
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="APlogo">
          <img src={emblemlogo} alt="Emblem" />
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
