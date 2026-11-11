import React, { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Housing", "Utilities", "Shopping", "Health", "Salary", "Other"];

export default function TransactionForm({ onSubmit, initial, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      type: "expense",
      amount: "",
      category: "Food",
      description: "",
      date: new Date().toISOString().slice(0, 10),
    }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      if (!initial) {
        setForm({ type: "expense", amount: "", category: "Food", description: "", date: form.date });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setForm({ ...form, type: "expense" })}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium ${
            form.type === "expense" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, type: "income" })}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium ${
            form.type === "income" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          Income
        </button>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
        <input
          type="number"
          name="amount"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          placeholder="500"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
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
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          placeholder="Dinner"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex-1 bg-brand-600 text-white text-sm font-medium py-2 rounded-md hover:bg-brand-700">
          {initial ? "Save changes" : `Add ${form.type === "income" ? "income" : "expense"}`}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-2 text-sm border border-gray-300 rounded-md">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
