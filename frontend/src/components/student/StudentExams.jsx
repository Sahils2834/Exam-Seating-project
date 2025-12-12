import React, { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";

export default function StudentExams(){
  const [exams, setExams] = useState([]);
  useEffect(()=>{ API.get('/exams').then(r=>setExams(r.data)).catch(()=>setExams([])); }, []);
  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Exams</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {exams.map(e=>(
          <div key={e._id} className="card">
            <h3 className="font-semibold">{e.title}</h3>
            <p className="small">{e.venue}</p>
            <p className="small">{e.date ? new Date(e.date).toLocaleString() : 'No date'}</p>
            <Link to={`/student/seating/${e._id}`} className="text-indigo-600 mt-2 inline-block">View Seating</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
