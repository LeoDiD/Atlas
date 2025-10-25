import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../pages/Sidebar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI/filters
  const [range, setRange] = useState("7d"); // '7d' | '30d' | '90d' | 'all' | 'custom'
  const [status, setStatus] = useState("all"); // 'all' | 'Completed' | 'Cancelled' | 'Pending'
  const [query, setQuery] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  // Get current user email
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || 
                      JSON.parse(localStorage.getItem("user")) || 
                      { email: "guest@example.com" };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        // Filter orders for current user only
        const userOrders = data.filter(order => 
          order.customerEmail === currentUser.email
        );
        // normalize/sort once (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(userOrders);
      })
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, [currentUser.email]);

  // Helper to compute date window from range
  const [startDate, endDate] = useMemo(() => {
    const end = new Date(); // now
    let start;
    switch (range) {
      case "7d":
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case "30d":
        start = new Date();
        start.setDate(start.getDate() - 30);
        break;
      case "90d":
        start = new Date();
        start.setDate(start.getDate() - 90);
        break;
      case "custom":
        start = customStart ? new Date(customStart) : null;
        // include whole end day
        const e = customEnd ? new Date(customEnd) : null;
        if (e) e.setHours(23, 59, 59, 999);
        return [start, e];
      case "all":
      default:
        return [null, null];
    }
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }, [range, customStart, customEnd]);

  // Derived filtered list
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.createdAt);

      // date window
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;

      // status
      if (status !== "all" && (o.status || "Pending") !== status) return false;

      // query: check ref tail, item names, orderType
      if (query.trim()) {
        const ref = (o._id || "").slice(-6).toUpperCase();
        const hay =
          [
            o.orderType || "",
            ref,
            ...(Array.isArray(o.items) ? o.items.map((i) => i.name || "") : []),
          ]
            .join(" ")
            .toLowerCase() || "";
        if (!hay.includes(query.toLowerCase())) return false;
      }

      return true;
    });
  }, [orders, startDate, endDate, status, query]);

  // Reset paging when filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [range, status, query, customStart, customEnd]);

  const shown = filtered.slice(0, visibleCount);

  const dateRangeLabel = (() => {
    if (range === "all") return "All time";
    if (range === "custom") {
      if (!startDate && !endDate) return "Custom range";
      const s = startDate ? startDate.toLocaleDateString() : "…";
      const e = endDate ? endDate.toLocaleDateString() : "…";
      return `${s} – ${e}`;
    }
    return {
      "7d": "Past 7 days",
      "30d": "Past 30 days",
      "90d": "Past 90 days",
    }[range];
  })();

  return (
    <div className="relative min-h-screen bg-[#E2E1E6]">

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#6B4226]">Order History</h1>
            <p className="text-sm text-gray-600">Showing: {dateRangeLabel}</p>
          </div>

          {/* Controls */}
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            {/* Quick ranges */}
            <div className="flex flex-wrap gap-2">
              {[
                { k: "7d", label: "7d" },
                { k: "30d", label: "30d" },
                { k: "90d", label: "90d" },
                { k: "all", label: "All" },
                { k: "custom", label: "Custom" },
              ].map((btn) => (
                <button
                  key={btn.k}
                  onClick={() => setRange(btn.k)}
                  className={`px-3 py-1.5 rounded-xl text-sm border ${
                    range === btn.k
                      ? "bg-[#6B4226] text-white border-[#6B4226]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Custom range pickers */}
            {range === "custom" && (
              <div className="flex flex-wrap items-end gap-2">
                <label className="text-xs text-gray-600">
                  Start
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="block mt-1 w-40 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                  />
                </label>
                <label className="text-xs text-gray-600">
                  End
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="block mt-1 w-40 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                  />
                </label>
              </div>
            )}

            {/* Status + search */}
            <div className="flex items-end gap-2">
              <label className="text-xs text-gray-600">
                Status
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block mt-1 w-64 rounded-lg border-2 border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4226]/30 focus:border-[#6B4226]" 
                >
                  <option value="all">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <label className="text-xs text-gray-600">
                Search (ref / item / type)
                <input
                  type="text"
                  placeholder="e.g. #A1B2C3, latte, dine-in…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block mt-1 w-64 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>

          {/* Empty state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4226] mb-4"></div>
              <p className="text-gray-500 text-lg font-medium">Loading orders...</p>
            </div>
          ) : shown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No orders found
              </p>
              <p className="text-gray-400 text-sm">
                {orders.length === 0 
                  ? "You haven't placed any orders yet."
                  : "Try a different date range, status, or search."}
              </p>
            </div>
          ) : (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {shown.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition duration-200"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-[#6B4226] capitalize">
                        {order.orderType}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          (order.status || "Pending") === "Completed"
                            ? "bg-green-100 text-green-700"
                            : (order.status || "Pending") === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    {/* Date & Ref */}
                    <div className="text-xs text-gray-500 mb-3">
                      <p>
                        {new Date(order.createdAt).toLocaleDateString()} •{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-[11px]">
                        Ref: #{(order._id || "").slice(-6).toUpperCase()}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="text-sm text-gray-700 space-y-1 mb-3">
                      {(order.items || []).slice(0, 2).map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.name} × {item.qty}
                          </span>
                          <span>₱{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      {(order.items || []).length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 2} more item
                          {order.items.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {/* Payment & Total */}
                    <div className="border-t border-gray-200 pt-3 mt-auto">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Payment</span>
                        <span>{order.paymentMethod || "GCash"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {(order.items || []).length} Item
                          {(order.items || []).length > 1 ? "s" : ""}
                        </span>
                        <span className="text-[#6B4226] font-bold text-sm">
                          ₱{Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="mt-4 text-xs bg-[#6B4226] text-white px-3 py-2 rounded-lg hover:bg-[#55331f] transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Load more */}
              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setVisibleCount((v) => v + 9)}
                    className="px-4 py-2 rounded-xl border text-sm border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Show more ({filtered.length - visibleCount} left)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold text-[#6B4226] mb-3">
                  Order Details
                </h2>

                <p className="text-xs text-gray-500 mb-1">
                  Order ID: #{(selectedOrder._id || "").slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>

                <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>₱{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-3 text-sm text-gray-600">
                  <p>Payment Method: {selectedOrder.paymentMethod || "GCash"}</p>
                  <p>Status: {selectedOrder.status || "Pending"}</p>
                  <p>
                    Total Amount:{" "}
                    <span className="font-bold text-[#6B4226]">
                      ₱{Number(selectedOrder.totalAmount || 0).toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-[#6B4226] text-white px-4 py-2 rounded-lg hover:bg-[#55331f] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
