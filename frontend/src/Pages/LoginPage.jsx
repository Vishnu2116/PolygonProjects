import React from "react";
import "../styles/LoginPageCss.css"; // CSS is applied globally
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      onLogin();
    } else {
      toast.error("Invalid username or password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="container">
      <div className="left">
        <img src="/andhraPradesh.png" alt="" />
      </div>
      <div className="right">
        <div className="title">
          <h1>Land Information Project </h1>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" align="center">
          <div className="formuptext">
            <br />
            <h1>Sign In</h1>
            <h5>Log in to your secure account</h5>
          </div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit"> Sign In</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
