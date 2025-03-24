import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";

function App() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/check-auth", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated));
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
