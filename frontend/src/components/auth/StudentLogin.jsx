
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    try {
      const res = await api.post("/auth/student-login", { studentId });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/student");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid studentId");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Student Login (ID)</h2>
        <input className="auth-input" placeholder="Student ID or Email" value={studentId} onChange={e=>setStudentId(e.target.value)} />
        <button className="btn-primary auth-btn" type="submit">Login</button>
        <div className="auth-links">
          <a onClick={()=>navigate("/login")}>Back to account login</a>
        </div>
      </form>
    </div>
  );
}
