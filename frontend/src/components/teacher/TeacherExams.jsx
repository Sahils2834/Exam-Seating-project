import React, { useEffect, useState } from "react";
import API from "../../api";
import Papa from 'papaparse';

export default function TeacherExams(){
  const [exams, setExams] = useState([]);
  useEffect(()=>{ API.get('/exams').then(r=>setExams(r.data)).catch(()=>setExams([])); }, []);

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Exams</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {exams.map(e => <ExamCard key={e._id} exam={e} />)}
      </div>
    </div>
  );
}

function ExamCard({ exam }){
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(()=>{ API.get(`/exams/${exam._id}/files`).then(r=>setFiles(r.data.files)).catch(()=>setFiles([])); }, [exam._id]);

  const onUpload = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    // preview CSV if csv
    if (file.name.toLowerCase().endsWith('.csv')) {
      Papa.parse(file, { header:true, complete: (res)=> setPreview(res.data.slice(0,50)), error:(err)=>alert('CSV error: '+err.message) });
    } else {
      setPreview(null);
    }
    // store selected for actual upload
    setSelectedFile(file);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return alert('Select file first');
    const form = new FormData(); form.append('file', selectedFile);
    await API.post(`/exams/${exam._id}/upload`, form, { headers: {'Content-Type':'multipart/form-data'} });
    const r = await API.get(`/exams/${exam._id}/files`); setFiles(r.data.files);
    setSelectedFile(null); setPreview(null);
    alert('Uploaded');
  };

  return (
    <div className="card">
      <h3 className="font-semibold">{exam.title}</h3>
      <p className="small">{exam.venue}</p>
      <p className="small">{exam.date ? new Date(exam.date).toLocaleString() : 'No date'}</p>

      <div style={{marginTop:12}}>
        <input type="file" onChange={onUpload} />
        {selectedFile && <div style={{marginTop:8}}><button className="btn btn-primary" onClick={confirmUpload}>Confirm Upload</button></div>}
        {preview && <div style={{marginTop:8, overflowX:'auto'}}>
          <h4 className="font-semibold">CSV Preview (first 50 rows)</h4>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{Object.keys(preview[0]||{}).map(h=> <th key={h} style={{textAlign:'left',padding:6,borderBottom:'1px solid #eee'}}>{h}</th>)}</tr></thead>
            <tbody>{preview.map((r,idx)=> <tr key={idx}>{Object.values(r).map((v,i)=> <td key={i} style={{padding:6,borderBottom:'1px solid #f6f6f6'}}>{v}</td>)}</tr>)}</tbody>
          </table>
        </div>}
        <div className="files-list mt-2">
          {files.map(f => <div key={f.name} className="file-item"><a href={`${(process.env.REACT_APP_API||'http://localhost:5000').replace('/api','')}/uploads/${exam._id}/${f.name}`} target="_blank" rel="noreferrer">{f.name}</a><span className="small">{Math.round(f.size/1024)} KB</span></div>)}
        </div>
      </div>
    </div>
  );
}
