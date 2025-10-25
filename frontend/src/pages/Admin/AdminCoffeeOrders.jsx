import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  RefreshCw,
  MoreVertical,
  Coffee,
  Check,
  X,
  Clock,
  ShoppingBag,
  ChefHat,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Sidebar from "./components/SidebarDB";
import NotificationBell from "./components/NotificationBell";

/* ------- UI helpers ------- */
function StatusBadge({ status }) {
  const map = {
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Preparing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Ready: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status === "Completed" ? (
        <Check className="w-3.5 h-3.5" />
      ) : status === "Cancelled" ? (
        <X className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      {status}
    </span>
  );
}

/* ------- adapters / utils ------- */
const adaptOrder = (doc) => ({
  id: doc.orderNumber || (doc._id ? String(doc._id) : "—"),
  customerEmail: doc.customerEmail || "—",
  items: (doc.items || []).map((it) => ({
    name: it.name,
    qty: it.qty ?? it.quantity ?? 1,
    size: it.size || "N/A",
    sugar: it.sugar || "N/A",
    addons: Array.isArray(it.addons) ? it.addons : [],
  })),
  total: doc.totalAmount ?? doc.total ?? 0,
  payment: doc.paymentStatus ?? doc.payment ?? "Paid",
  placedAt: doc.createdAt ?? doc.placedAt ?? null,
  status: doc.status ?? "Pending",
});

export default function AdminCoffeeOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/orders");
        const raw = Array.isArray(res?.data)
          ? res.data
          : res?.data?.orders || res?.data?.results || [];
        const list = raw.map(adaptOrder);
        if (mounted) setOrders(list);
      } catch (e) {
        console.error("Failed to load orders:", e);
        if (mounted) {
          // fallback demo data
          setOrders([
            adaptOrder({
              _id: "ORD-1001",
              customerEmail: "barbara@example.com",
              items: [
                { name: "Iced Latte", qty: 1, size: "Medium", sugar: "50%", addons: ["Extra Shot"] },
                { name: "Espresso", qty: 2, size: "Small", sugar: "No Sugar", addons: [] },
              ],
              totalAmount: 245,
              status: "Preparing",
              createdAt: "2025-10-12T09:21:00",
              paymentStatus: "Paid",
            }),
            adaptOrder({
              _id: "ORD-1000",
              customerEmail: "alex@example.com",
              items: [{ name: "Cold Brew", qty: 1, size: "Large", sugar: "100%", addons: ["Whipped Cream", "Caramel Drizzle"] }],
              totalAmount: 120,
              status: "Completed",
              createdAt: "2025-10-12T08:55:00",
              paymentStatus: "Paid",
            }),
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const ordersArr = Array.isArray(orders) ? orders : [];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ordersArr.filter((o) => {
      // Only show non-completed orders in the table
      if (o.status === "Completed") return false;
      
      const matchesQ =
        term === "" ||
        o.id?.toLowerCase().includes(term) ||
        o.customerEmail?.toLowerCase().includes(term) ||
        (o.items || []).some((it) =>
          it.name?.toLowerCase().includes(term)
        );
      const matchesStatus = status === "All" || o.status === status;
      return matchesQ && matchesStatus;
    });
  }, [ordersArr, q, status]);

  const formatPeso = (n) =>
    `₱${Number(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const updateOrderStatus = async (id, newStatus) => {
    try {
      // Call API to update status
      await axios.patch(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus });
      
      console.log(`✅ Order ${id} status updated to ${newStatus}`);
      
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      
      // Show success message
      if (newStatus === "Completed") {
        toast.success("✅ Order completed! Confirmation email sent to customer.");
      } else {
        toast.success(`✅ Order status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("❌ Failed to update order status:", err);
      toast.error("❌ Failed to update order status. Please try again.");
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = ordersArr.filter(o => o.status === "Pending").length;
    const preparing = ordersArr.filter(o => o.status === "Preparing").length;
    const ready = ordersArr.filter(o => o.status === "Ready").length;
    const completed = ordersArr.filter(o => o.status === "Completed").length;
    
    return { pending, preparing, ready, completed };
  }, [ordersArr]);

  return (
    <div className="flex min-h-screen bg-[#E2E1E6]">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col h-screen overflow-hidden ml-20">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#6B4226]/10 flex items-center justify-center">
              <Coffee className="h-5 w-5 text-[#6B4226]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Coffee Orders
              </h1>
              <p className="text-xs text-gray-500">
                Manage and track orders for coffee items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search order, email, or item…"
                className="pl-9 pr-3 py-2 w-64 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4226]/30"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4226]/30"
            >
              {[
                "All",
                "Pending",
                "Preparing",
                "Ready",
                "Cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 shrink-0">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Orders awaiting confirmation</p>
          </div>

          {/* Preparing Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preparing</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{stats.preparing}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Orders being prepared</p>
          </div>

          {/* Ready Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ready</p>
                <p className="text-2xl font-bold text-violet-700 mt-1">{stats.ready}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-violet-50 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-violet-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Orders ready for pickup</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Successfully fulfilled orders</p>
          </div>
        </div>

        {/* Scrollable Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left font-medium px-4 py-3">Order</th>
                  <th className="text-left font-medium px-4 py-3">
                    Customer Email
                  </th>
                  <th className="text-left font-medium px-4 py-3">Items</th>
                  <th className="text-left font-medium px-4 py-3">Placed</th>
                  <th className="text-left font-medium px-4 py-3">Payment</th>
                  <th className="text-left font-medium px-4 py-3">Total</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-16 text-center text-gray-500"
                    >
                      No coffee orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o, index) => (
                    <tr key={o.id} className="hover:bg-gray-50/80">
                      {/* ORDER NUMBER */}
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        <span className="inline-flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-gray-100">
                            #{index + 1}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({o.id.slice(-4)})
                          </span>
                        </span>
                      </td>

                      {/* CUSTOMER EMAIL */}
                      <td className="px-4 py-4 text-gray-800">
                        {o.customerEmail ?? "—"}
                      </td>

                      {/* ITEMS */}
                      <td className="px-4 py-3 text-gray-700 max-w-md">
                        <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-2">
                          {(o.items || []).map((it, idx) => (
                            <div
                              key={idx}
                              className="px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-100"
                            >
                              <div className="font-medium text-gray-900 text-sm mb-0.5">
                                {it.qty} × {it.name}
                              </div>
                              <div className="text-[11px] text-gray-600 flex flex-wrap gap-x-3 gap-y-0.5">
                                <span>
                                  <span className="font-medium">Size:</span> {it.size}
                                </span>
                                <span>
                                  <span className="font-medium">Sugar:</span> {it.sugar}
                                </span>
                                {it.addons && it.addons.length > 0 && (
                                  <span className="w-full">
                                    <span className="font-medium">Add-ons:</span>{" "}
                                    {it.addons.join(", ")}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* PLACED DATE */}
                      <td className="px-4 py-4 text-gray-600">
                        {o.placedAt
                          ? new Date(o.placedAt).toLocaleString()
                          : "—"}
                      </td>

                      {/* PAYMENT */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                            o.payment === "Paid"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {o.payment || "—"}
                        </span>
                      </td>

                      {/* TOTAL */}
                      <td className="px-4 py-4 font-semibold">
                        {formatPeso(o.total)}
                      </td>

                      {/* STATUS - Interactive Dropdown */}
                      <td className="px-4 py-4">
                        {o.status === "Completed" || o.status === "Cancelled" ? (
                          <StatusBadge status={o.status} />
                        ) : (
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 focus:outline-none focus:ring-2 transition-all ${
                              o.status === "Pending"
                                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : o.status === "Preparing"
                                ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : o.status === "Ready"
                                ? "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
                                : "border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready to Pick Up</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-600 bg-white shrink-0">
              <span>Total orders: {filtered.length}</span>
              <span>
                Revenue:{" "}
                <strong>
                  {formatPeso(
                    filtered.reduce(
                      (sum, o) => sum + Number(o.total || 0),
                      0
                    )
                  )}
                </strong>
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
