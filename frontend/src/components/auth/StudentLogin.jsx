import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/auth.css";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier) {
      setError("Enter Roll Number or Email");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/student-login", {
        identifier
      });

      // Save session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/student");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid Student ID or Email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="glass-card auth-card" onSubmit={submit}>
        <h2 className="auth-title">Student Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          className="auth-input"
          placeholder="Roll Number or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <button className="btn-purple auth-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-links">
          <Link to="/login">Back to Account Login</Link>
        </div>
      </form>
    </div>
  );
}
