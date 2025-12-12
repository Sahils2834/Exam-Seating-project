
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Register() {
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("student");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, role });
      alert("Registered. Wait for admin approval (if required).");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Create Account</h2>

        <input className="auth-input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="auth-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

        <select className="auth-input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button className="btn-primary auth-btn" type="submit">Sign up</button>
      </form>
    </div>
  );
}
