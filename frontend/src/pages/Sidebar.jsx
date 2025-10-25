import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, User, Box, LogOut, Camera } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const brand = "#6B4226";

  const items = [
    { to: "/menu/Coffee",     icon: <Home size={20} />,     label: "Home" },
    { to: "/orders",   icon: <FileText size={20} />, label: "Orders" },
    { to: "/photobooth", icon: <Camera size={20} />, label: "Photobooth" },
    { to: "/profile",  icon: <User size={20} />,     label: "Profile" },
  ];

  const handleConfirmLogout = () => {
    try { localStorage.clear(); } catch {}
    navigate("/login", { replace: true });
  };

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowLogout(false);
    if (showLogout) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLogout]);

  return (
    <>
      {/* Bottom Nav */}
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        <nav className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 px-3 py-2 flex items-center justify-between">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                `relative group flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] transition
                 ${isActive
                   ? "text-[#6B4226] bg-[#6B4226]/10"
                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`
              }
            >
              {({ isActive }) => (
                <>
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                  {/* Tooltip */}
                  <span
                    className={
                      `pointer-events-none absolute -top-2 translate-y-[-100%] px-2 py-1 rounded-md
                       text-xs font-medium shadow opacity-0 transition-opacity
                       group-hover:opacity-100 group-focus-within:opacity-100 ` +
                      (isActive ? "bg-[#6B4226] text-white" : "bg-gray-900 text-white")
                    }
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Logout trigger (replaces Settings) */}
          <button
            onClick={() => setShowLogout(true)}
            aria-label="Logout"
            title="Logout"
            className="relative group flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <LogOut size={20} />
            <span className="sr-only">Logout</span>
            <span className="pointer-events-none absolute -top-2 translate-y-[-100%] px-2 py-1 rounded-md text-xs font-medium shadow opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 bg-gray-900 text-white">
              Logout
            </span>
          </button>
        </nav>
      </div>

      {/* Confirm Logout Modal */}
      {showLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogout(false)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90%] max-w-sm p-5">
            <h2 id="logout-title" className="text-lg font-semibold text-gray-900">
              Log out?
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              You’re about to log out of your account.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                autoFocus
                onClick={() => setShowLogout(false)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: brand }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
