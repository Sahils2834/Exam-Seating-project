import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AllowedUsers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    role: "student",
    name: "",
    designation: ""
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/allowed");
      setList(res.data || []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const addAllowed = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.role) {
      return alert("Identifier & role required");
    }

    try {
      await api.post("/admin/allowed", form);

      setForm({
        identifier: "",
        role: "student",
        name: "",
        designation: ""
      });

      load();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to add allowed user");
    }
  };

  const removeOne = async (id) => {
    if (!window.confirm("Remove this allowed user?")) return;

    try {
      await api.delete(`/admin/allowed/${id}`);
      load();
    } catch {
      alert("Failed to remove user");
    }
  };

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Allowed Users</h1>

      {/* ADD FORM */}
      <form onSubmit={addAllowed} className="card p-4 mb-4 grid gap-3">

        <input
          className="auth-input"
          placeholder="Identifier (Email or Roll Number)"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />

        <select
          className="auth-input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          className="auth-input"
          placeholder="Name (optional)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="auth-input"
          placeholder="Designation (optional)"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
        />

        <button className="btn btn-primary">Add Allowed User</button>
      </form>

      {/* LIST */}
      <div className="card p-4">

        {loading && <p>Loading allowed users...</p>}

        {!loading && list.length === 0 && (
          <p className="text-gray-500">No allowed users yet.</p>
        )}

        {!loading && list.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <b>{u.name || u.identifier}</b>
              <div className="text-sm opacity-70">
                Role: {u.role} {u.designation ? `— ${u.designation}` : ""}
              </div>
              <div className="text-xs opacity-50">
                Identifier: {u.identifier}
              </div>
            </div>

            <button className="btn-ghost text-red-500" onClick={() => removeOne(u._id)}>
              Remove
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}