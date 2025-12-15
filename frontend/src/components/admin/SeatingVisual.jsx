import React, { useEffect, useState } from "react";
import api from "../../api";
import "./SeatingVisual.css";

export default function SeatingVisual({ examId }) {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);

  useEffect(() => {
    load();
  }, [examId]);

  const load = async () => {
    try {
      const res = await api.get(`/exam/${examId}/plans`);
      setPlans(res.data);
      if (res.data.length > 0) setActivePlan(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!activePlan) return <p>Loading seating plan...</p>;

  const { hall, allocations } = activePlan;

  return (
    <div className="seating-container">
      <div className="glass-header">
        <h2>{activePlan.examName}</h2>
        <p>
          <strong>Hall:</strong> {hall.hallName} • {hall.rows} Rows × {hall.cols} Columns
        </p>

        <select
          className="glass-select"
          value={activePlan._id}
          onChange={(e) => {
            const selected = plans.find((p) => p._id === e.target.value);
            setActivePlan(selected);
          }}
        >
          {plans.map((p) => (
            <option key={p._id} value={p._id}>
              Hall: {p.hall.hallName}
            </option>
          ))}
        </select>
      </div>

      <div
        className="seating-grid glass-grid"
        style={{
          gridTemplateColumns: `repeat(${hall.cols}, 1fr)`,
          gridTemplateRows: `repeat(${hall.rows}, auto)`,
        }}
      >
        {allocations.map((seat, index) => (
          <div key={index} className="seat-card glass-seat">
            <div className="seat-number">{seat.seatNumber}</div>
            <div className="seat-student">{seat.student?.name || "Unknown"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
