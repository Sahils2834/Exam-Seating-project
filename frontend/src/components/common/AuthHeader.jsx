import React from "react";
import { NavLink } from "react-router-dom";

export default function AuthHeader() {
  return (
    <div className="auth-header">
      <NavLink to="/login" className="auth-link">Login</NavLink>
      <NavLink to="/register" className="auth-link">Sign Up</NavLink>
      <NavLink to="/student-login" className="auth-link">Student Login</NavLink>
    </div>
  );
}
