import React from "react";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return <p className="text-sm text-gray-500 py-8 text-center">No transactions yet.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {t.category}
              {t.description && <span className="text-gray-400 font-normal"> · {t.description}</span>}
            </p>
            <p className="text-xs text-gray-500">{t.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
            </span>
            <button onClick={() => onEdit(t)} className="text-xs text-gray-500 hover:text-gray-800">
              Edit
            </button>
            <button onClick={() => onDelete(t.id)} className="text-xs text-red-500 hover:text-red-700">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
