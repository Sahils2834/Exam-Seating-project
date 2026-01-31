import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return null;
  const role = user.role;

  const LinkItem = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <span className="s-label">{label}</span>
    </NavLink>
  );

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">ES</div>

      <nav className="sidebar-nav">

        {role === "admin" && (
          <>
            <LinkItem to="/admin" label="Dashboard" />
            <LinkItem to="/admin/exams" label="Manage Exams" />
            <LinkItem to="/admin/allowed" label="Allowed Users" />
            <LinkItem to="/admin/requests" label="Requests" />
            <LinkItem to="/admin/settings" label="Settings" />
          </>
        )}

        {role === "teacher" && (
          <>
            <LinkItem to="/teacher" label="Dashboard" />
            <LinkItem to="/teacher/exams" label="My Exams" />
            <LinkItem to="/teacher/uploads" label="Upload History" />
            <LinkItem to="/teacher/profile" label="Profile" />
          </>
        )}

        {role === "student" && (
          <>
            <LinkItem to="/student" label="Dashboard" />
            <LinkItem to="/student/exams" label="Exams" />
            <LinkItem to="/student/seating" label="Seating Info" />
            <LinkItem to="/student/profile" label="Profile" />
          </>
        )}

      </nav>
    </aside>
  );
}
