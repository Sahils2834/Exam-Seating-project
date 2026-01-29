import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    date: "",
    room: "",
    time: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const examsRes = await api.get("/exams");

      // ✅ Load REAL registered teachers
      const teachersRes = await api.get("/admin/users?role=teacher");

      setExams(examsRes.data || []);
      setTeachers(teachersRes.data || []);
    } catch {
      setExams([]);
      setTeachers([]);
    }
  };

  const createExam = async () => {
    if (!form.title || !form.date) {
      alert("Title & Date required");
      return;
    }

    await api.post("/exams", form);
    setForm({ title: "", subject: "", date: "", room: "", time: "" });
    loadData();
  };

  const assignTeacher = async (examId, teacherId) => {
    if (!teacherId) return;
    await api.post(`/exams/${examId}/assign-teacher`, { teacherId });
    loadData();
  };

  const togglePublish = async (exam) => {
    await api.put(`/exams/${exam._id}`, {
      isPublished: !exam.isPublished
    });
    loadData();
  };

  return (
    <div className="container p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        <p className="text-gray-500 text-sm">
          Create exams & assign teachers
        </p>
      </div>

      {/* CREATE EXAM */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Create New Exam</h3>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="input"
            placeholder="Exam Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="input"
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />

          <input
            className="input"
            type="datetime-local"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="input"
            placeholder="Room"
            value={form.room}
            onChange={e => setForm({ ...form, room: e.target.value })}
          />

          <input
            className="input"
            placeholder="Time"
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
          />
        </div>

        <button className="btn btn-primary mt-4" onClick={createExam}>
          Create Exam
        </button>
      </div>

      {/* EXAM LIST */}
      <div className="grid md:grid-cols-2 gap-4">

        {exams.length === 0 && (
          <p className="text-gray-500">No exams created yet</p>
        )}

        {exams.map(exam => (
          <div key={exam._id} className="card p-5 hover:shadow-md transition">

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{exam.title}</h3>

                <p className="small">{exam.subject || "No subject"}</p>

                <p className="small text-gray-500">
                  {new Date(exam.date).toLocaleString()}
                </p>
              </div>

              <button
                className="btn-ghost"
                onClick={() => togglePublish(exam)}
              >
                {exam.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>

            {/* ASSIGNED TEACHERS */}
            <div className="small mb-2">
              <strong>Assigned Teachers:</strong>{" "}
              {exam.assignedTeachers?.length
                ? exam.assignedTeachers.map(t => (
                    <span key={t._id} className="tag ml-1">
                      {t.name}
                    </span>
                  ))
                : "None"}
            </div>

            {/* ASSIGN TEACHER */}
            <select
              className="input mt-2"
              onChange={e => assignTeacher(exam._id, e.target.value)}
              defaultValue=""
            >
              <option value="">Assign Teacher</option>

              {teachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>

          </div>
        ))}
      </div>
    </div>
  );
}
