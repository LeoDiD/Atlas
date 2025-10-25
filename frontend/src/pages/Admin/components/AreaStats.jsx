import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Espresso-based", value: 45, color: "#6B4226" },   // Dark brown - espresso drinks
  { name: "Cold Brew", value: 28, color: "#B68D40" },        // Medium brown - cold brew
  { name: "Specialty Lattes", value: 27, color: "#E6B980" }, // Light brown - specialty drinks
];

export default function AreaStats() {
  const total = data.reduce((a, b) => a + b.value, 0);
  const totalOrders = 1050; // Monthly completed orders

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 w-full h-[450px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h3 className="text-base md:text-lg font-semibold text-gray-800">Coffee Category Distribution</h3>
        <button className="text-[#6B4226] text-sm font-medium hover:underline">more →</button>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 gap-y-2 gap-x-4 text-sm text-gray-700 mb-4">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
              <span className="truncate">{d.name}</span>
            </div>
            <span className="font-medium">{d.value}%</span>
          </div>
        ))}
      </div>

      {/* Donut */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              startAngle={90}
              endAngle={-270}
              paddingAngle={6}
              cornerRadius={20}
              isAnimationActive={false}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>

            {/* Center text */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.6em" fontSize="13" fill="#9ca3af">Total orders</tspan>
              <tspan x="50%" dy="1.5em" fontSize="28" fontWeight="700" fill="#6B4226">
                {totalOrders.toLocaleString()}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
