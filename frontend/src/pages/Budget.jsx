import React, { useEffect, useState } from "react";
import { api } from "../api";

const CATEGORIES = ["Food", "Transport", "Housing", "Utilities", "Shopping", "Health", "Other"];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");
  const month = new Date().toISOString().slice(0, 7);

  const load = () => api.getBudgets(month).then(setBudgets).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!limit || Number(limit) <= 0) {
      setError("Enter a limit greater than 0.");
      return;
    }
    try {
      await api.saveBudget({ category, monthly_limit: Number(limit), month });
      setLimit("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    await api.deleteBudget(id);
    load();
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        <h1 className="text-lg font-semibold text-gray-900">Monthly budget · {month}</h1>

        {budgets.length === 0 && <p className="text-sm text-gray-500">No category budgets set yet.</p>}

        {budgets.map((b) => {
          const pct = Math.min(100, Math.round((b.spent / b.monthly_limit) * 100));
          const over = b.spent > b.monthly_limit;
          return (
            <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-900">{b.category}</span>
                <button onClick={() => handleDelete(b.id)} className="text-xs text-red-500">
                  Remove
                </button>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full ${over ? "bg-red-500" : "bg-brand-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                ₹{b.spent.toLocaleString()} of ₹{b.monthly_limit.toLocaleString()} spent
                {over && <span className="text-red-600 font-medium"> · over budget</span>}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-900 mb-2">Set a category budget</h2>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Monthly limit (₹)</label>
            <input
              type="number"
              min="0"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              placeholder="5000"
            />
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white text-sm font-medium py-2 rounded-md hover:bg-brand-700">
            Save budget
          </button>
        </form>
      </div>
    </div>
  );
}
