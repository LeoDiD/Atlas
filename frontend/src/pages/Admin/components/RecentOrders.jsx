// components/RecentOrders.jsx
import React, { useEffect, useState } from "react";
import { Check, Clock, X, MoreVertical } from "lucide-react";
import axios from "axios";

function StatusBadge({ status }) {
  const map = {
    Completed: {
      icon: <Check className="w-3.5 h-3.5" />,
      class: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100",
    },
    Pending: {
      icon: <Clock className="w-3.5 h-3.5" />,
      class: "text-amber-600 bg-amber-50 ring-1 ring-amber-100",
    },
    Preparing: {
      icon: <Clock className="w-3.5 h-3.5" />,
      class: "text-blue-600 bg-blue-50 ring-1 ring-blue-100",
    },
    "Ready to Pick Up": {
      icon: <Check className="w-3.5 h-3.5" />,
      class: "text-purple-600 bg-purple-50 ring-1 ring-purple-100",
    },
    Cancelled: {
      icon: <X className="w-3.5 h-3.5" />,
      class: "text-rose-600 bg-rose-50 ring-1 ring-rose-100",
    },
  };
  const m = map[status] ?? map.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${m.class}`}>
      {m.icon}
      {status}
    </span>
  );
}

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        // Get most recent 10 orders
        const recentOrders = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setOrders(recentOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 h-[450px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-base md:text-lg font-semibold text-gray-800">Orders History</h3>
        <button className="text-emerald-600 text-sm font-medium hover:underline">more →</button>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B4226]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Clock className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-gray-500">
                <th className="text-left font-medium pb-3">Order Number</th>
                <th className="text-left font-medium pb-3">Customer</th>
                <th className="text-left font-medium pb-3">Status</th>
                <th className="text-left font-medium pb-3">Date & Time</th>
                <th className="text-left font-medium pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/60">
                  <td className="py-3">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 font-semibold text-gray-800 text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-gray-700">
                    <div className="max-w-[150px] truncate">{order.customerEmail}</div>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={order.status || "Pending"} />
                  </td>
                  <td className="py-3 text-gray-700">
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="py-3 font-semibold">
                    <span className="text-emerald-600">
                      ₱{order.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
