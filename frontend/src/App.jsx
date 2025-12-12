import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthHeader from "./components/common/AuthHeader";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import StudentLogin from "./components/auth/StudentLogin";

import AdminDashboard from "./components/admin/AdminDashboard";
import AllowedUsers from "./components/admin/AllowedUsers";
import Requests from "./components/admin/Requests";
import AdminSettings from "./components/admin/AdminSettings";

import StudentDashboard from "./components/student/StudentDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";

import "./styles/global.css";
import "./styles/dashboard.css";

function Layout({ children }) {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  const hideLayout = ["/login", "/register", "/student-login"].includes(
    location.pathname
  );

  useEffect(() => {
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  return (
    <>
      {/* Show Auth Header ONLY on login/register/student-login */}
      {hideLayout && <AuthHeader />}

      {/* Show Navbar + Sidebar for all other pages */}
      {!hideLayout && <Navbar onToggle={() => setCollapsed(s => !s)} />}
      {!hideLayout && <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />}

      <main className={hideLayout ? "auth-wrap" : "content-container"}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-login" element={<StudentLogin />} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/allowed" element={<ProtectedRoute role="admin"><AllowedUsers /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute role="admin"><Requests /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
