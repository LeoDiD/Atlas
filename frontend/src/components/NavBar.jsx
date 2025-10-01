import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-6 h-20 bg-[#E2E1E6]">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/atlas.png" // logo from public folder
          alt="Atlas Coffee Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Links - centered */}
      <ul className="hidden md:flex gap-12 text-lg text-gray-800 font-medium absolute left-1/2 transform -translate-x-1/2">
        <li className="hover:text-amber-700 cursor-pointer transition-colors">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-amber-700 cursor-pointer transition-colors">
          About Us
        </li>
        <li className="hover:text-amber-700 cursor-pointer transition-colors">
          Contact
        </li>
      </ul>

      {/* Buttons */}
      <div className="flex gap-2 bg-gray-900 rounded-full p-1">
        <Link 
          to="/login"
          className="px-5 py-1.5 rounded-full bg-[#6B4226] text-white text-sm font-medium hover:bg-amber-800 transition-colors"
        >
          Login
        </Link>
        <Link 
          to="/signup"
          className="px-5 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
