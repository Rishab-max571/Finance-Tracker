import React, { useEffect, useState } from "react";
import { api } from "../api";
import ExpenseChart from "../components/ExpenseChart";

const CARDS = [
  { key: "balance", label: "Balance", color: "text-gray-900" },
  { key: "income", label: "Income", color: "text-green-600" },
  { key: "expenses", label: "Expenses", color: "text-red-600" },
  { key: "savings", label: "Savings", color: "text-brand-600" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CARDS.map((c) => (
          <div key={c.key} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-semibold mt-1 ${c.color}`}>₹{data[c.key].toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-2">Expenses by category</h2>
        <ExpenseChart data={data.expenses_by_category} />
      </div>
    </div>
  );
}
