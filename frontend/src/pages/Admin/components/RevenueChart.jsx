import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RevenueChart() {
  const data = [
    { name: "1 AUG", revenue: 23000 },
    { name: "2 AUG", revenue: 15000 },
    { name: "3 AUG", revenue: 17000 },
    { name: "4 AUG", revenue: 19000 },
    { name: "5 AUG", revenue: 22000 },
    { name: "6 AUG", revenue: 25000 },
    { name: "7 AUG", revenue: 23000 },
    { name: "8 AUG", revenue: 24000 },
  ];

  return (
    // 👇 Match the left stack height: 140 + 20 + 140 = 300px
    <div className="bg-white rounded-2xl shadow-md p-6 w-full h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Revenue</h2>
          <p className="text-sm text-gray-400">This month vs last</p>
        </div>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition" />
      </div>

      {/* Chart fills the remaining height under the header */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `₱${Number(value).toLocaleString()}`}
              contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="revenue" fill="#4F46E5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
