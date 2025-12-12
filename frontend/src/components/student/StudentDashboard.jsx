import React from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard(){
  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="card-grid">
        <Link to="/student/exams" className="card">Exams</Link>
        <Link to="/student/profile" className="card">Profile</Link>
      </div>
    </div>
  );
}
