import React, { useEffect, useState } from "react";
import API from "../../api";

export default function StudentProfile(){
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/students/profile")
      .then(res => setProfile(res.data))
      .catch(()=>setProfile(null));
  }, []);

  if (!profile) return <div className="container p-6">Loading...</div>;

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div className="card">
        <p><strong>Name:</strong> {profile.user?.name || "-"}</p>
        <p><strong>Email:</strong> {profile.user?.email || "-"}</p>
        <p><strong>Roll:</strong> {profile.rollNumber}</p>
        <p><strong>Course:</strong> {profile.course || "-"}</p>
      </div>
    </div>
  );
}
