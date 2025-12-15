import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rollNumber, setRollNumber] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register-request", {
        name,
        email,
        password,
        role,
        rollNumber: role === "student" ? rollNumber : undefined,
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="glass-card auth-card" onSubmit={submit}>
        <h2 className="auth-title">Create Account</h2>

        <input className="auth-input" placeholder="Full Name"
          value={name} onChange={(e) => setName(e.target.value)} />

        <input className="auth-input" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="auth-input"
          placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <select className="auth-input" value={role}
          onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {role === "student" && (
          <input className="auth-input" placeholder="Roll Number"
            value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
        )}

        <button className="btn-primary auth-btn">Sign Up</button>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}
