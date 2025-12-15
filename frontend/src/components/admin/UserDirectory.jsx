import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/dashboard.css";

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const res = await api.get("/admin/allowed?q=" + q);
    setUsers(res.data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <h2 className="page-title">Allowed Users Directory</h2>

      <div className="search-row">
        <input
          placeholder="Search by name / email / roll number…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-purple" onClick={load}>Search</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Identifier</th>
              <th>Role</th>
              <th>Designation</th>
              <th>Added On</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name || "-"}</td>
                <td>{u.identifier}</td>
                <td className="role-badge">{u.role}</td>
                <td>{u.designation || "-"}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
