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
import AdminExams from "./components/admin/AdminExams";

import StudentDashboard from "./components/student/StudentDashboard";
import StudentExams from "./components/student/StudentExams";
import StudentProfile from "./components/student/StudentProfile";
import StudentSeating from "./components/student/StudentSeating";

import TeacherDashboard from "./components/teacher/TeacherDashboard";
import TeacherUploads from "./components/teacher/UploadHistory";
import TeacherProfile from "./components/teacher/TeacherProfile";
import TeacherExams from "./components/teacher/TeacherExams";

import "./styles/global.css";
import "./styles/dashboard.css";

/* ================= LAYOUT ================= */

function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  const hideLayout = ["/login", "/register", "/student-login"].includes(location.pathname);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  return (
    <>
      {hideLayout && <AuthHeader />}

      {!hideLayout && (
        <div className="app-layout">
          <Sidebar collapsed={collapsed} />

          <div className="content-container">
            <Navbar onToggle={() => setCollapsed(prev => !prev)} />
            {children}
          </div>
        </div>
      )}

      {hideLayout && <main className="auth-wrap">{children}</main>}
    </>
  );
}

/* ================= REDIRECT ================= */

function HomeRedirect() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  if (user.role === "teacher") return <Navigate to="/teacher" />;
  if (user.role === "student") return <Navigate to="/student" />;

  return <Navigate to="/login" />;
}

/* ================= APP ================= */

export default function App() {
  return (
    <BrowserRouter>
  <Layout>
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-login" element={<StudentLogin />} />

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/exams" element={<ProtectedRoute role="admin"><AdminExams /></ProtectedRoute>} />
      <Route path="/admin/allowed" element={<ProtectedRoute role="admin"><AllowedUsers /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role="admin"><Requests /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/exams" element={<ProtectedRoute role="teacher"><TeacherExams /></ProtectedRoute>} />
      <Route path="/teacher/uploads" element={<ProtectedRoute role="teacher"><TeacherUploads /></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute role="teacher"><TeacherProfile /></ProtectedRoute>} />

      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/exams" element={<ProtectedRoute role="student"><StudentExams /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/seating" element={<ProtectedRoute role="student"><StudentSeating /></ProtectedRoute>} />

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  </Layout>
</BrowserRouter>

  );
}
