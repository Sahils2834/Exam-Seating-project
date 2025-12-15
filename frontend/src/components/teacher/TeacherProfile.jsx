import React, { useEffect, useState } from "react";
import API from "../../api";

export default function TeacherProfile(){
  const [profile, setProfile] = useState(null);

  useEffect(()=>{
    API.get("/teachers/profile")
      .then(r => setProfile(r.data))
      .catch(err => {
        console.error("PROFILE LOAD ERROR:", err);
        setProfile({});
      });
  }, []);

  if (!profile) return <div className="container p-6">Loading...</div>;

  return (
    <div className="container p-6">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div className="card">
        <p><strong>Name:</strong> {profile.user?.name || "Unknown"}</p>
        <p><strong>Email:</strong> {profile.user?.email || "-"}</p>
        <p><strong>Department:</strong> {profile.department || "-"}</p>
      </div>
    </div>
  );
}
