import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";

export default function StudentSeating(){
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(()=>{
    if(!examId) return;
    API.get(`/exams/${examId}`).then(r=>setExam(r.data)).catch(()=>setExam(null));
    API.get(`/exams/${examId}/files`).then(r=>setFiles(r.data.files)).catch(()=>setFiles([]));
  }, [examId]);

  if (!exam) return <div className="container p-6">Loading...</div>;

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">{exam.title} — Seating</h1>

      <div className="grid gap-2 mb-4">
        {Array.from({ length: exam.rows }).map((_, r)=>(
          <div key={r} className="flex gap-2">
            {Array.from({ length: exam.cols }).map((__, c)=> {
              const idx = r * exam.cols + c;
              const seat = exam.seats && exam.seats[idx] ? exam.seats[idx] : { studentName:'', studentId:'' };
              return (
                <div key={c} className="seat">
                  <div className="font-medium">Seat {r+1}-{c+1}</div>
                  <div className="small">{seat.studentName || '-'}</div>
                  <div className="small">{seat.studentId || ''}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Uploaded files</h3>
        {files.length===0 ? <div>No files</div> : files.map(f=>(
          <div key={f.name} className="file-item">
            <a href={`${(process.env.REACT_APP_API||'http://localhost:5000').replace('/api','')}/uploads/${examId}/${f.name}`} target="_blank" rel="noreferrer">{f.name}</a>
            <span className="small">{Math.round(f.size/1024)}KB</span>
          </div>
        ))}
      </div>
    </div>
  );
}
