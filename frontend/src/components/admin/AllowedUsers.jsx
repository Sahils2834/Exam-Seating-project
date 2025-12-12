import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AllowedUsers(){
  const [list,setList] = useState([]);

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    try{
      const res = await api.get("/admin/allowed");
      setList(res.data);
    }catch(e){ console.error(e); }
  };

  const removeOne = async (id)=> {
    if(!window.confirm("Remove this allowed entry?")) return;
    try { await api.delete(`/admin/allowed/${id}`); load(); } catch(e){alert("Failed");}
  };

  return (
    <div>
      <h1 className="page-title">Allowed Users</h1>
      <div className="card">
        {list.length===0 ? <p>No allowed users</p> :
          list.map(u=>(
            <div key={u._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
              <div>{u.identifier} <small style={{color:"#666"}}>[{u.role}]</small></div>
              <div><button className="btn-ghost" onClick={()=>removeOne(u._id)}>Remove</button></div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
