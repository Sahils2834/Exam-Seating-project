import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return children;

  return (
    <div>
      <Sidebar />
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}
