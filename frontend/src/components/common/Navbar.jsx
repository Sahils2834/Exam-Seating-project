import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onToggle }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [dark, setDark] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="nav-bar">
      <div className="nav-left">
        <button className="hamburger" onClick={onToggle} aria-label="toggle sidebar">☰</button>
        <div className="brand">Exam Seating</div>
      </div>

      <div className="nav-right">
        <label className="switch">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          <span className="slider" />
        </label>

        {user ? (
          <div className="nav-user">
            <span className="nav-username">{user.name || user.email}</span>
            <button className="btn-ghost" onClick={() => navigate("/admin")}>Dashboard</button>
            <button className="btn-ghost" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
          </div>
        )}
      </div>
    </header>
  );
}
