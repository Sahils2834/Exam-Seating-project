import React, { useEffect, useState } from "react";
import api from "../../api";

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

      const res = await api.get(`/teachers/uploads?page=${page}&limit=10`);

      setData({
        items: res.data.items || [],
        page: res.data.page || 1,
        total: res.data.total || 0,
        limit: res.data.limit || 10
      });

    } catch (err) {
      console.error("UPLOAD HISTORY ERROR:", err);
      setData({ items: [], page: 1, total: 0, limit: 10 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads(1);
  }, []);

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="card p-4">
      <h2 className="mb-3 text-xl font-semibold">Upload History</h2>

      {/* Loading */}
      {loading && <div>Loading uploads...</div>}

      {/* Empty */}
      {!loading && data.items.length === 0 && (
        <div className="text-gray-500">No uploads found.</div>
      )}

      {/* List */}
      {!loading && data.items.map((file) => (
        <div key={file._id} className="upload-item flex justify-between items-center mb-3">

          <div>
            <strong>{file.originalName || file.filename}</strong>

            <div className="small opacity-70">
              Exam: {file.exam?.title || "Unknown"} <br />
              Uploaded: {new Date(file.createdAt).toLocaleString()}
            </div>
          </div>

          <a
            className="btn btn-primary"
            href={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${file.filename}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        </div>
      ))}

      {/* Pagination */}
      {!loading && data.total > data.limit && (
        <div className="pagination mt-3 flex items-center gap-3">

          <button
            className="btn"
            onClick={() => loadUploads(data.page - 1)}
            disabled={data.page === 1}
          >
            Prev
          </button>

          <span className="small">
            Page {data.page} of {totalPages || 1}
          </span>

          <button
            className="btn"
            onClick={() => loadUploads(data.page + 1)}
            disabled={data.page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
