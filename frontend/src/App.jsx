import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";

// ✅ Use environment variable for backend API base
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

function App() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/check-auth`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to check auth");
        return res.json();
      })
      .then((data) => setAuthenticated(data.authenticated))
      .catch((err) => {
        console.error("Auth check error:", err);
        setAuthenticated(false); // fallback to login screen
      });
  }, []);

  if (authenticated === null) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <Navigate to="/home" />
            ) : (
              <LoginPage onLogin={() => setAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/home"
          element={
            authenticated ? (
              <HomePage onLogout={() => setAuthenticated(false)} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
