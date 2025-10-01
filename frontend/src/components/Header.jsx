import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      {/* Left side */}
      <h2 className="text-lg font-semibold text-gray-700">
        Welcome to <span className="text-[#6B4226]">Atlas Coffee Dashboard</span>
      </h2>

      {/* Center Search */}
      <div className="flex-1 px-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#6B4226]/70 focus:outline-none"
          />
          <span className="absolute right-4 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Right side (User) */}
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-gray-700 font-medium">Bryle James</span>
      </div>
    </header>
  );
}
