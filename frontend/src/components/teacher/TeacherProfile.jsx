import React, { useEffect, useState } from "react";
import api from "../../api";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    department: "",
    designation: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/teachers/profile");
      setProfile(res.data);

      setForm({
        department: res.data?.department || "",
        designation: res.data?.designation || ""
      });

    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setError("");

      await api.put("/teachers/profile", form);

      await loadProfile();
      alert("Profile updated successfully");

    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container p-6">Loading profile...</div>;

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Teacher Profile</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="card p-4 space-y-3">

        <p><strong>Name:</strong> {profile?.user?.name || "Unknown"}</p>
        <p><strong>Email:</strong> {profile?.user?.email || "-"}</p>

        <div>
          <label className="block small mb-1">Department</label>
          <input
            className="auth-input"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="Enter department"
          />
        </div>

        <div>
          <label className="block small mb-1">Designation</label>
          <input
            className="auth-input"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            placeholder="Enter designation"
          />
        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}
