import React from "react";
import Sidebar from "../pages/Sidebar";
import MenuPage from "./MenuPage"; // ✅ import MenuPage

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-[#E2E1E6] p-6 overflow-y-auto">
        {/* Menu Page content shows here */}
        <MenuPage />
      </div>
    </div>
  );
}
