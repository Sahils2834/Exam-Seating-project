import React, { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    exams: 0,
    uploads: 0,
    lastUpload: null,
    name: "",
    email: ""
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const examsRes = await API.get("/exams");
      const examCount = examsRes.data.length;

      const uploadsRes = await API.get("/teachers/uploads?page=1&limit=1");
      const uploadCount = uploadsRes.data.total;
      const lastUpload = uploadsRes.data.items[0] || null;

      const profileRes = await API.get("/teachers/profile");

      setStats({
        exams: examCount,
        uploads: uploadCount,
        lastUpload,
        name: profileRes.data?.user?.name || "",
        email: profileRes.data?.user?.email || ""
      });

    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="glass-card p-4">
          <h3 className="stat-title">Assigned Exams</h3>
          <div className="stat-number">{stats.exams}</div>
        </div>

        <div className="glass-card p-4">
          <h3 className="stat-title">Total Uploads</h3>
          <div className="stat-number">{stats.uploads}</div>
        </div>

        <div className="glass-card p-4">
          <h3 className="stat-title">Last Upload</h3>
          <div className="stat-small">
            {stats.lastUpload
              ? <>
                  {stats.lastUpload.originalName}
                  <br />
                  <small className="opacity-60">
                    {new Date(stats.lastUpload.createdAt).toLocaleString()}
                  </small>
                </>
              : "No uploads yet"}
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="stat-title">Profile</h3>
          <div className="stat-small">
            {stats.name} <br />
            <small className="opacity-60">{stats.email}</small>
          </div>
        </div>

      </div>

      <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-4">

        <Link to="/teacher/exams" className="action-card">
          <div className="action-title">Manage Exams</div>
          <p className="action-desc">View and upload CSV files for seating.</p>
        </Link>

        <Link to="/teacher/uploads" className="action-card">
          <div className="action-title">Upload History</div>
          <p className="action-desc">View and download previously uploaded files.</p>
        </Link>

        <Link to="/teacher/profile" className="action-card">
          <div className="action-title">My Profile</div>
          <p className="action-desc">View and update your profile details.</p>
        </Link>

      </div>
    </div>
  );
}
