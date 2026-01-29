import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await api.get("/student/exams");
      setExams(res.data || []);
    } catch (err) {
      console.error("Failed to load exams:", err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-6 space-y-4">

      <h1 className="text-xl font-bold">My Exams</h1>

      {loading && <p>Loading exams...</p>}
      {!loading && exams.length === 0 && (
        <p className="text-gray-500">No exams available yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {exams.map((e) => (
          <div
            key={e._id}
            className="card clickable hover-scale p-5"
            onClick={() => navigate(`/student/seating/${e._id}`)}
          >
            <h3 className="font-semibold text-lg">{e.title}</h3>

            <p className="small">Subject: {e.subject || "Not set"}</p>
            <p className="small">Room: {e.room || "Not assigned"}</p>
            <p className="small text-gray-500">
              Date: {e.date ? new Date(e.date).toLocaleString() : "Not scheduled"}
            </p>

            <span className="text-indigo-600 mt-2 inline-block font-medium">
              View Seating →
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
