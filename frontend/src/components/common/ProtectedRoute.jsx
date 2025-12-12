import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;

  return children;
}
