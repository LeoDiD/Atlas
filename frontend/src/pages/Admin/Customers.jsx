import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Users,
  Mail,
  ShoppingBag,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SidebarDB from "./components/SidebarDB";
import NotificationBell from "./components/NotificationBell";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  /* ------------------- Load Customers ------------------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Fetch all orders and group by customer email
        const ordersRes = await axios.get("http://localhost:5000/api/orders");
        const orders = Array.isArray(ordersRes?.data)
          ? ordersRes.data
          : ordersRes?.data?.orders || [];

        // Group orders by customer email
        const customerMap = {};
        orders.forEach((order) => {
          const email = order.customerEmail || "Unknown";
          if (!customerMap[email]) {
            customerMap[email] = {
              email: email,
              orders: [],
              totalSpent: 0,
              totalOrders: 0,
            };
          }
          customerMap[email].orders.push(order);
          customerMap[email].totalSpent += order.totalAmount || order.total || 0;
          customerMap[email].totalOrders += 1;
        });

        const customerList = Object.values(customerMap).sort(
          (a, b) => b.totalSpent - a.totalSpent
        );

        if (mounted) setCustomers(customerList);
      } catch (err) {
        console.error("Failed to load customers:", err);
        // Fallback demo data
        if (mounted) {
          setCustomers([
            {
              email: "barbara@example.com",
              totalOrders: 15,
              totalSpent: 3250,
              orders: [
                {
                  orderNumber: "ORD-1001",
                  totalAmount: 245,
                  status: "Completed",
                  createdAt: "2025-10-12T09:21:00",
                  items: [
                    { name: "Iced Latte", qty: 1 },
                    { name: "Espresso", qty: 2 },
                  ],
                },
                {
                  orderNumber: "ORD-0998",
                  totalAmount: 180,
                  status: "Completed",
                  createdAt: "2025-10-10T14:30:00",
                  items: [{ name: "Cold Brew", qty: 2 }],
                },
              ],
            },
            {
              email: "alex@example.com",
              totalOrders: 8,
              totalSpent: 1560,
              orders: [
                {
                  orderNumber: "ORD-1000",
                  totalAmount: 120,
                  status: "Completed",
                  createdAt: "2025-10-12T08:55:00",
                  items: [{ name: "Cold Brew", qty: 1 }],
                },
              ],
            },
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

  /* ------------------- Search Filter ------------------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return customers.filter((c) => c.email.toLowerCase().includes(term));
  }, [customers, q]);

  const formatPeso = (n) =>
    `₱${Number(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const toggleExpand = (email) => {
    setExpandedCustomer(expandedCustomer === email ? null : email);
  };

  return (
    <div className="flex min-h-screen bg-[#E2E1E6]">
      <SidebarDB />

      <main className="flex-1 p-6 ml-20 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#6B4226]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#6B4226]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
              <p className="text-xs text-gray-500">
                View customer profiles and transaction history
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
                placeholder="Search by email…"
                className="pl-9 pr-3 py-2 w-64 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4226]/30"
              />
            </div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Customers</span>
              <Users className="h-5 w-5 text-[#6B4226]" />
            </div>
            <p className="text-2xl font-bold text-[#6B4226]">
              {customers.length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Orders</span>
              <ShoppingBag className="h-5 w-5 text-[#6B4226]" />
            </div>
            <p className="text-2xl font-bold text-[#6B4226]">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <DollarSign className="h-5 w-5 text-[#6B4226]" />
            </div>
            <p className="text-2xl font-bold text-[#6B4226]">
              {formatPeso(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
            </p>
          </div>
        </div>

        {/* Scrollable Customer List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr className="text-gray-600">
                  <th className="text-left font-medium px-4 py-3">#</th>
                  <th className="text-left font-medium px-4 py-3">Customer Email</th>
                  <th className="text-left font-medium px-4 py-3">Total Orders</th>
                  <th className="text-left font-medium px-4 py-3">Total Spent</th>
                  <th className="text-left font-medium px-4 py-3">Avg Order Value</th>
                  <th className="text-right font-medium px-4 py-3 pr-5">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer, index) => (
                    <React.Fragment key={customer.email}>
                      {/* Customer Row */}
                      <tr className="hover:bg-gray-50/80">
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {customer.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {customer.totalOrders} orders
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-emerald-600">
                          {formatPeso(customer.totalSpent)}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {formatPeso(customer.totalSpent / customer.totalOrders)}
                        </td>
                        <td className="px-4 py-4 pr-5 text-right">
                          <button
                            onClick={() => toggleExpand(customer.email)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B4226] bg-[#6B4226]/10 hover:bg-[#6B4226]/20 transition-colors"
                          >
                            {expandedCustomer === customer.email ? (
                              <>
                                Hide Orders <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                View Orders <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {expandedCustomer === customer.email && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 bg-gray-50/50">
                            <div className="ml-8 mr-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                Order History
                              </h4>
                              <div className="space-y-2">
                                {customer.orders.map((order) => (
                                  <div
                                    key={order.orderNumber || order._id}
                                    className="bg-white rounded-lg p-4 border border-gray-200"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 bg-gray-100 rounded-md font-semibold text-sm">
                                          {order.orderNumber || order._id}
                                        </span>
                                        <span
                                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            order.status === "Completed"
                                              ? "bg-emerald-50 text-emerald-700"
                                              : order.status === "Pending"
                                              ? "bg-amber-50 text-amber-700"
                                              : order.status === "Preparing"
                                              ? "bg-blue-50 text-blue-700"
                                              : order.status === "Ready"
                                              ? "bg-violet-50 text-violet-700"
                                              : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          {order.status}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                          {formatPeso(order.totalAmount || order.total)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {order.createdAt
                                            ? new Date(order.createdAt).toLocaleString()
                                            : "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {(order.items || []).map((item, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                                        >
                                          {item.qty || item.quantity} × {item.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-600 bg-white shrink-0">
              <span>Showing {filtered.length} customers</span>
              <span>
                Total Revenue:{" "}
                <strong>
                  {formatPeso(filtered.reduce((sum, c) => sum + c.totalSpent, 0))}
                </strong>
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
