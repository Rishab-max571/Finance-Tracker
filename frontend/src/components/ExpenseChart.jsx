import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0f9d78", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#6b7280"];

export default function ExpenseChart({ data }) {
  const entries = Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  if (!entries.length) {
    return <p className="text-sm text-gray-500 py-10 text-center">Add some expenses to see the breakdown.</p>;
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={entries} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {entries.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
