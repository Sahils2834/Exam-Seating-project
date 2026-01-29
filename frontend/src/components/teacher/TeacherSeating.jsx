import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function TeacherSeating() {
  const { examId } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get(`/api/seatingplan/${examId}`).then(res => {
      setPlan(res.data);
    });
  }, [examId]);

  if (!plan) return <div className="page">No seating data</div>;

  return (
    <div className="page">
      <h2 className="page-title">Hall Seating View</h2>

      <div className="seat-grid" style={{ gridTemplateColumns: "repeat(10, 80px)" }}>
        {plan.allocations.map((seat, i) => (
          <div key={i} className="seat-box occupied">
            <div className="seat-number">{seat.seatNumber}</div>
            <div className="seat-roll">{seat.rollNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
