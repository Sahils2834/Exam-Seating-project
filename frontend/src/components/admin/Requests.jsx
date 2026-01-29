import React, { useEffect, useState } from "react";
import api from "../../api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/requests");
      setRequests(res.data || []);
    } catch (e) {
      console.error("REQUEST LOAD ERROR:", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await api.post(`/admin/requests/${id}/approve`);
      alert("User approved successfully");
      load();
    } catch (e) {
      alert("Approve failed");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this request?")) return;

    try {
      await api.post(`/admin/requests/${id}/reject`);
      alert("Request rejected");
      load();
    } catch (e) {
      alert("Reject failed");
    }
  };

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Pending Requests</h1>

      <div className="card p-4">

        {loading && <p>Loading requests...</p>}

        {!loading && requests.length === 0 && (
          <p className="text-gray-500">No pending requests</p>
        )}

        {!loading && requests.map((r) => (
          <div
            key={r._id}
            className="flex justify-between items-center py-3 border-b"
          >
            <div>
              <strong>{r.name}</strong>

              <div className="text-sm opacity-70">
                Role: {r.role}
              </div>

              {r.role === "student" && (
                <div className="text-xs opacity-60">
                  Roll Number: {r.rollNumber || "N/A"}
                </div>
              )}

              {r.email && (
                <div className="text-xs opacity-60">
                  Email: {r.email}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={() => approve(r._id)}>
                Approve
              </button>

              <button className="btn-ghost text-red-500" onClick={() => reject(r._id)}>
                Reject
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
