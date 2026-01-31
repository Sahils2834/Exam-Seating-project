import React, { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentSeating() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) {
      console.error("❌ examId missing in URL");
      setLoading(false);
      return;
    }

    api
      .get(`/exams/${examId}/uploads`)
      .then((res) => {
        setRows(res.data.rows || []);
        setFilename(res.data.filename || "");
      })
      .catch((err) => {
        console.error("SEATING LOAD ERROR:", err);
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [examId]);

  if (!examId) {
    return (
      <div className="page">
        <p>Invalid exam selection.</p>
        <button className="btn-primary" onClick={() => navigate("/student/exams")}>
          Go back to exams
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="page">Loading seating arrangement…</div>;
  }

  if (!rows.length) {
    return <div className="page">No seating uploaded yet.</div>;
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="page">
      <h2 className="page-title">Seating Arrangement</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <strong>Source File:</strong> {filename}
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => (
                  <td key={h}>{row[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
