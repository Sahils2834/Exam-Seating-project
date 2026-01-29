import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboardRes = await api.get("/teachers/dashboard");
      const uploadsRes = await api.get("/teachers/uploads?page=1&limit=1");

      const lastUpload = uploadsRes.data.items?.[0] || null;

      setData({
        ...dashboardRes.data,
        lastUpload
      });

    } catch (err) {
      console.error("Teacher dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading teacher dashboard...</p>;

  return (
    <div className="container p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        {data?.teacher && (
          <p className="text-gray-500 text-sm">
            Welcome, <strong>{data.teacher.name}</strong> ({data.teacher.email})
          </p>
        )}
      </div>

      {/* ===== STATS ===== */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="card p-5">
          <h3 className="stat-title">Assigned Exams</h3>
          <div className="stat-number">{data?.examsCount || 0}</div>
        </div>

        <div className="card p-5">
          <h3 className="stat-title">Total Uploads</h3>
          <div className="stat-number">{data?.uploadsCount || 0}</div>
        </div>

        <div className="card p-5">
          <h3 className="stat-title">Last Upload</h3>
          <div className="text-sm text-gray-600">
            {data?.lastUpload ? (
              <>
                <strong>{data.lastUpload.originalName}</strong>
                <br />
                <span className="text-xs opacity-70">
                  {new Date(data.lastUpload.createdAt).toLocaleString()}
                </span>
              </>
            ) : (
              "No uploads yet"
            )}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="stat-title">Profile</h3>
          <div className="text-sm text-gray-600">
            {data?.teacher?.name}
            <br />
            <span className="text-xs opacity-70">
              {data?.teacher?.email}
            </span>
          </div>
        </div>

      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

        <div className="grid md:grid-cols-3 gap-4">

          <Link to="/teacher/exams" className="action-card hover-scale">
            <div className="action-title">Manage Exams</div>
            <p className="action-desc">View and manage assigned exams</p>
          </Link>

          <Link to="/teacher/uploads" className="action-card hover-scale">
            <div className="action-title">Upload History</div>
            <p className="action-desc">See previous uploads</p>
          </Link>

          <Link to="/teacher/profile" className="action-card hover-scale">
            <div className="action-title">My Profile</div>
            <p className="action-desc">View & update profile</p>
          </Link>

        </div>
      </div>

    </div>
  );
}
