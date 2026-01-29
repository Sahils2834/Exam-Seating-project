import React, { useEffect, useState } from "react";
import api from "../../api";
import Papa from "papaparse";

export default function TeacherExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await api.get("/exams/teacher/exams");
      setExams(res.data || []);
    } catch {
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading assigned exams...</p>;

  return (
    <div className="container p-6 space-y-4">
      <h1 className="text-xl font-bold">Assigned Exams</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {exams.length === 0 && <p>No exams assigned yet</p>}
        {exams.map((e) => (
          <ExamCard key={e._id} exam={e} />
        ))}
      </div>
    </div>
  );
}

function ExamCard({ exam }) {
  const [uploads, setUploads] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadUploads();
  }, [exam._id]);

  const loadUploads = async () => {
    try {
      const res = await api.get(`/exams/${exam._id}/files`);
      setUploads(res.data.files || []);
    } catch {
      setUploads([]);
    }
  };

  const onUpload = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        complete: (res) => setPreview(res.data.slice(0, 50))
      });
    } else {
      setPreview(null);
    }

    setSelectedFile(file);
  };

  const upload = async (endpoint) => {
    if (!selectedFile) return alert("Select file first");

    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", selectedFile);

      await api.post(`/exams/${exam._id}/${endpoint}`, form);

      await loadUploads();
      setSelectedFile(null);
      setPreview(null);

      alert("Upload successful");
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-5 space-y-3 hover:shadow-md transition">

      <div>
        <h3 className="font-semibold text-lg">{exam.title}</h3>
        <p className="small">{exam.subject || "No subject"}</p>
        <p className="small text-gray-500">
          {new Date(exam.date).toLocaleString()}
        </p>
      </div>

      <input type="file" onChange={onUpload} />

      {selectedFile && (
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={uploading} onClick={() => upload("upload")}>
            Upload File
          </button>

          {selectedFile.name.endsWith(".csv") && (
            <button className="btn btn-secondary" disabled={uploading} onClick={() => upload("upload-seating")}>
              Upload Seating CSV
            </button>
          )}
        </div>
      )}

      {preview && (
        <div className="overflow-x-auto text-xs">
          <table className="w-full border">
            <thead>
              <tr>
                {Object.keys(preview[0]).map(h => (
                  <th key={h} className="border p-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((r, i) => (
                <tr key={i}>
                  {Object.values(r).map((v, j) => (
                    <td key={j} className="border p-1">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm space-y-1">
        {uploads.map(f => (
          <div key={f._id} className="flex justify-between">
            <a href={`http://localhost:5000${f.path}`} target="_blank" rel="noreferrer">
              {f.originalName}
            </a>
            <span>{Math.round(f.size / 1024)} KB</span>
          </div>
        ))}
      </div>
    </div>
  );
}
