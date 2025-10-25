import React, { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Coffee,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const brand = "#6B4226";
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const modalRef = useRef(null);

  const links = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/admin" },
    { name: "Orders", icon: <ShoppingBag size={22} />, path: "/admin/orders" },
    { name: "Products", icon: <Coffee size={22} />, path: "/admin/products" },
    { name: "Customers", icon: <Users size={22} />, path: "/admin/customers" },
    { name: "Analytics", icon: <BarChart3 size={22} />, path: "/admin/analytics" },
  ];

  const handleLogout = () => {
    try { localStorage.clear(); } catch {}
    navigate("/login");
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutModal(false);
  };

  // Close on ESC
  useEffect(() => {
    if (!showLogoutModal) return;
    const onKey = (e) => e.key === "Escape" && setShowLogoutModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLogoutModal]);

  return (
    <>
      <aside className="w-20 bg-white text-gray-800 border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col items-center justify-between py-6 shadow-sm z-50">
        <div className="flex flex-col items-center gap-5">
          <NavLink to="/admin" className="group relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-gray-200 bg-white shadow transition-all group-hover:ring-gray-300 group-hover:shadow-md">
              <img
                src="/atlas.png"
                alt="Atlas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </NavLink>

          <nav className="flex flex-col items-center gap-4 mt-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                title={link.name}
                className={({ isActive }) =>
                  `group relative p-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#F5E6D3] text-[#6B4226]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
                end={link.path === "/admin"}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full"
                        style={{ backgroundColor: brand }}
                      />
                    )}
                    {link.icon}
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded shadow transition-all">
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="h-px w-10 bg-gray-200" />
          <button
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLogoutModal(false)}       // outside click closes
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop layer (grayscale + dim + blur; doesn't blur modal) */}
          <div
            className="
              absolute inset-0 pointer-events-none
              bg-transparent
              backdrop-grayscale
              backdrop-brightness-75
              backdrop-blur-[2px]
              supports-[backdrop-filter]:backdrop-blur-[2px]
            "
          />
          {/* Fallback light tint for browsers without backdrop-filter */}
          <div className="absolute inset-0 pointer-events-none supports-not-[backdrop-filter]:bg-black/20" />

          {/* Modal panel (stays sharp) */}
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}          // keep clicks inside
            className="relative z-10 bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from the admin dashboard?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#6B4226] text-white font-medium hover:bg-[#5a3620] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
