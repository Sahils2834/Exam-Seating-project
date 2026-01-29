import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  // No session → redirect to correct login
  if (!token || !user) {
    const studentPath = location.pathname.startsWith("/student");
    return <Navigate to={studentPath ? "/student-login" : "/login"} />;
  }

  // Role mismatch → redirect to correct dashboard
  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "teacher") return <Navigate to="/teacher" />;
    if (user.role === "student") return <Navigate to="/student" />;

    return <Navigate to="/login" />;
  }

  return children;
}
