import React from "react";
import Sidebar from "../pages/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#E2E1E6] p-6">
        <h1 className="text-3xl font-bold text-[#6B4226]">Welcome to Home</h1>
        {/* Add your content here */}
      </div>
    </div>
  );
}
