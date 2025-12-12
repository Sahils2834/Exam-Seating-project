import React, { useEffect, useState } from "react";
import api from "../../api";

export default function Requests(){
  const [requests,setRequests] = useState([]);

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    try { const res = await api.get("/admin/requests"); setRequests(res.data); } catch(e){ console.error(e); }
  };

  const approve = async (id) => {
    try { await api.post(`/admin/requests/${id}/approve`); load(); }
    catch(e){ alert("Approve failed"); }
  };

  const reject = async (id) => {
    if(!window.confirm("Reject request?")) return;
    try { await api.post(`/admin/requests/${id}/reject`); load(); }
    catch(e){ alert("Reject failed"); }
  };

  return (
    <div>
      <h1 className="page-title">Pending Requests</h1>

      <div className="card">
        {requests.length===0 ? <p>No pending requests</p> : requests.map(r=>(
          <div key={r._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
            <div>
              <strong>{r.name}</strong><div style={{color:'#666'}}>{r.email} — {r.role}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn-primary" onClick={()=>approve(r._id)}>Approve</button>
              <button className="btn-ghost" onClick={()=>reject(r._id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
