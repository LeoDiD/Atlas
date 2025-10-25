import React from "react";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";

export default function TopBar() {
  const tabs = [
    { name: "Coffee", to: "/menu/Coffee" },
    { name: "Cold Brew", to: "/menu/Cold Brew" },
    { name: "Frappe", to: "/menu/Frappe" },
    { name: "Pastry", to: "/menu/Pastry" },
    { name: "Tea", to: "/menu/Tea" },
  ];

  return (
    // Transparent, no border/background
    <div className="sticky top-0 z-50 w-full">
      {/* 3 zones: [left | center | right] */}
      <div className="mx-auto max-w-screen-2xl px-4 h-20 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* LEFT: brand pill */}
        <NavLink
          to="/home"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 shadow-sm"
        >
          <img src="/atlas.png" alt="Atlas" className="h-6 w-6 rounded-md object-cover" />
          <span className="text-sm font-semibold text-gray-900">Atlas</span>
        </NavLink>

        {/* CENTER: tabs pill */}
        <nav className="hidden md:flex justify-self-center items-center gap-1 px-1 py-1 rounded-full bg-gray-100 shadow-sm">
          {tabs.map((t) => (
            <NavLink
              key={t.name}
              to={t.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm transition
                 ${isActive
                   ? "bg-white text-gray-900 shadow"
                   : "text-gray-600 hover:text-gray-900 hover:bg-white/70"}`
              }
            >
              {t.name}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: account pill + round action */}
        <div className="justify-self-end flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-100 shadow-sm">
            <div className="h-7 w-7 rounded-full overflow-hidden ring-1 ring-gray-200">
              <img src="/atlas.png" alt="user" className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-medium text-gray-800">Hi, Leovi</span>
          </div>
          <button
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm"
            title="New"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
