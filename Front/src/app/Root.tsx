import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";

export function Root() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <Outlet />
    </div>
  );
}
