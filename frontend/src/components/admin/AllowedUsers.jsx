import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AllowedUsers() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/admin/allowed");
      setList(res.data);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  const removeOne = async (id) => {
    if (!window.confirm("Remove this allowed user?")) return;
    try {
      await api.delete(`/admin/allowed/${id}`);
      load();
    } catch (err) {
      alert("Failed to remove user");
    }
  };

  return (
    <div>
      <h1 className="page-title">Allowed Users</h1>

      <div className="card">
        {list.length === 0 ? (
          <p>No allowed users</p>
        ) : (
          list.map((u) => (
            <div
              key={u._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 4px",
              }}
            >
              <div>
                <b>{u.name || u.identifier}</b>
                <div style={{ fontSize: 13, color: "#6b6b6b" }}>
                  {u.role} — {u.designation || ""}
                </div>
              </div>

              <button className="btn-ghost" onClick={() => removeOne(u._id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
