import React, { useEffect, useState } from "react";
import API from "../../api";

export default function UploadHistory() {
  const [data, setData] = useState({
    items: [],
    page: 1,
    total: 0,
    limit: 10
  });

  const [loading, setLoading] = useState(false);

  const loadUploads = async (page = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/teachers/uploads?page=${page}&limit=10`);
      setData(res.data);
    } catch (err) {
      console.error("UPLOAD HISTORY ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads(1);
  }, []);

  return (
    <div className="card">
      <h2 className="mb-3">Upload History</h2>

      {loading && <div>Loading...</div>}
      {!loading && data.items.length === 0 && <div>No uploads found.</div>}

      {!loading && data.items.map((file) => (
        <div key={file._id} className="upload-item">
          <div>
            <strong>{file.originalName}</strong>
            <div className="small">
              Exam: {file.exam?.title || "Unknown"}<br />
              Uploaded: {new Date(file.createdAt).toLocaleString()}
            </div>
          </div>

          <a
            className="btn"
            href={`http://localhost:5000${file.path}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        </div>
      ))}

      <div className="pagination">
        <button className="btn" onClick={() => loadUploads(data.page - 1)} disabled={data.page === 1}>
          Prev
        </button>

        <span className="small">Page {data.page}</span>

        <button
          className="btn"
          onClick={() => loadUploads(data.page + 1)}
          disabled={data.items.length < data.limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}
