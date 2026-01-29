import React, { useEffect, useState } from "react";
import api from "../../api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/student/profile")
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  if (!profile) return <div className="container p-6">Loading profile...</div>;

  return (
    <div className="container p-6 space-y-3">
      <h1 className="text-xl font-bold">Profile</h1>

      <div className="card p-4">
        <p><strong>Name:</strong> {profile.user?.name}</p>
        <p><strong>Email:</strong> {profile.user?.email}</p>
        <p><strong>Roll:</strong> {profile.rollNumber || "-"}</p>
        <p><strong>Course:</strong> {profile.course || "-"}</p>
        <p><strong>Year:</strong> {profile.year || "-"}</p>
      </div>
    </div>
  );
}
