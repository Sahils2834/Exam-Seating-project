// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "teacher") navigate("/teacher");
      else navigate("/student");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="glass-card auth-card" onSubmit={submit}>
        <h2 className="auth-title">Account Login</h2>

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn-purple auth-btn">
          Login
        </button>

        <div className="auth-links">
          <Link to="/register">Sign Up</Link> |{" "}
          <Link to="/student-login">Student Login</Link>
        </div>
      </form>
    </div>
  );
}
