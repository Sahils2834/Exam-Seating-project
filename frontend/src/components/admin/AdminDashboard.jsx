
import React, { useEffect, useState } from "react";
import api from "../../api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ admin:0, teacher:0, student:0, pending:0 });

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const data = [
    { name: "Admin", value: stats.admin },
    { name: "Teacher", value: stats.teacher },
    { name: "Student", value: stats.student }
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="card-grid">
        <div className="card">
          <div className="stat-title">Total Admins</div>
          <div className="stat-number">{stats.admin}</div>
        </div>

        <div className="card">
          <div className="stat-title">Total Teachers</div>
          <div className="stat-number">{stats.teacher}</div>
        </div>

        <div className="card">
          <div className="stat-title">Total Students</div>
          <div className="stat-number">{stats.student}</div>
        </div>

        <div className="card">
          <div className="stat-title">Pending Requests</div>
          <div className="stat-number">{stats.pending}</div>
        </div>
      </div>

      <div className="card chart-card">
        <h3>User Role Distribution</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#7C5CFF" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
