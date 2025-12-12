
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed = false, onCollapseChange = () => {} }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  useEffect(() => {
    onCollapseChange(collapsed);
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
  }, [collapsed]);

  if (!user) return null;
  const role = user.role;

  const Link = ({ to, label }) => (
    <NavLink to={to} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
      <span className="s-label">{label}</span>
    </NavLink>
  );

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">ES</div>

      <nav className="sidebar-nav">
        {role === "admin" && (
          <>
            <Link to="/admin" label="Dashboard" />
            <Link to="/admin/allowed" label="Allowed Users" />
            <Link to="/admin/requests" label="Requests" />
            <Link to="/admin/settings" label="Settings" />
          </>
        )}

        {role === "teacher" && (
          <>
            <Link to="/teacher" label="Dashboard" />
            <Link to="/teacher/exams" label="Exams" />
            <Link to="/teacher/uploads" label="Upload History" />
            <Link to="/teacher/profile" label="Profile" />
          </>
        )}

        {role === "student" && (
          <>
            <Link to="/student" label="Dashboard" />
            <Link to="/student/exams" label="Exams" />
            <Link to="/student/profile" label="Profile" />
          </>
        )}
      </nav>
    </aside>
  );
}
