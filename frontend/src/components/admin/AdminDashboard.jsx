import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    admin: 0,
    teacher: 0,
    student: 0,
    pending: 0
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      const pendingRes = await api.get("/admin/requests");

      setStats({
        admin: statsRes.data.admin || 0,
        teacher: statsRes.data.teacher || 0,
        student: statsRes.data.student || 0,
        pending: pendingRes.data?.length || 0
      });
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);
    }
  };

  const data = [
    { name: "Admin", value: stats.admin },
    { name: "Teacher", value: stats.teacher },
    { name: "Student", value: stats.student }
  ];

  return (
    <div className="container p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">
          System overview & statistics
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="card stat-card">
          <div className="stat-title">Admins</div>
          <div className="stat-number">{stats.admin}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-title">Teachers</div>
          <div className="stat-number">{stats.teacher}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-title">Students</div>
          <div className="stat-number">{stats.student}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-title">Pending Requests</div>
          <div className="stat-number text-orange-600">
            {stats.pending}
          </div>
        </div>

      </div>

      {/* ===== CHART ===== */}
      <div className="card p-5">
        <h3 className="mb-3 font-semibold text-lg">
          User Role Distribution
        </h3>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
