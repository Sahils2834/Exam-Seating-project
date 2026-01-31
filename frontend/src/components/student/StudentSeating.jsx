import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentSeating() {
  const { examId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/exams/${examId}/plans`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPlan(res.data[0]);
        }
      })
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <div className="page">Loading seating...</div>;

  if (!plan || !plan.allocations?.length)
    return <div className="page">No seating assigned yet.</div>;

  const mySeat = plan.allocations.find(
    a => a.rollNumber === user.rollNumber
  );

  return (
    <div className="page">
      <h2 className="page-title">Seating Plan</h2>

      {mySeat && (
        <div className="card" style={{ marginBottom: 16 }}>
          <strong>Your Seat:</strong> {mySeat.seatNumber}
        </div>
      )}

      <div
        className="seat-grid"
        style={{ gridTemplateColumns: `repeat(8, 80px)` }}
      >
        {plan.allocations.map((seat, i) => (
          <div
            key={i}
            className={`seat-box ${
              seat.rollNumber === user.rollNumber ? "my-seat" : "occupied"
            }`}
          >
            <div className="seat-number">{seat.seatNumber}</div>
            <div className="seat-roll">{seat.rollNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
