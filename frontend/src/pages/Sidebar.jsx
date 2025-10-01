import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, User, Box, Settings } from "lucide-react";
import atlasLogo from "/atlas.png";

export default function Sidebar() {
  const menuItems = [
    { name: "Home", path: "/home", icon: <Home size={24} /> },
    { name: "Orders", path: "/orders", icon: <FileText size={24} /> },
    { name: "Profile", path: "/profile", icon: <User size={24} /> },
    { name: "Products", path: "/products", icon: <Box size={24} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={24} /> },
  ];

  return (
    <div className="h-screen w-20 bg-white border-r flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-10">
        <img src={atlasLogo} alt="Atlas Coffee" className="h-10 w-auto" />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center justify-center group ${
                isActive ? "text-[#6B4226]" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Right indicator only */}
                {isActive && (
                  <span className="absolute right-[-16px] w-1 h-6 bg-[#6B4226] rounded-l"></span>
                )}

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {item.icon}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
