import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/student/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Student dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="container p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>

        {data?.student && (
          <p className="text-gray-500 text-sm">
            Welcome, <strong>{data.student.name}</strong>
            {data.student.rollNumber && ` (${data.student.rollNumber})`}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-4">

        <div className="card p-5">
          <h3 className="stat-title">Total Exams</h3>
          <div className="stat-number">{data?.examsCount || 0}</div>
        </div>

        <div
          className="card clickable hover-scale p-5"
          onClick={() => navigate("/student/exams")}
        >
          <h3 className="font-semibold">View Exams</h3>
          <p className="small text-gray-500">See upcoming exams</p>
        </div>

        <div
          className="card clickable hover-scale p-5"
          onClick={() => navigate("/student/profile")}
        >
          <h3 className="font-semibold">Profile</h3>
          <p className="small text-gray-500">View & update profile</p>
        </div>

        <div
          className="card clickable hover-scale p-5"
          onClick={() => navigate("/student/exams")}
        >
          <h3 className="font-semibold">Seating Info</h3>
          <p className="small text-gray-500">View seat allocation</p>
        </div>

      </div>
    </div>
  );
}
