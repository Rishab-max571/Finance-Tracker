import React, { useEffect, useState } from "react";
import { api } from "../api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = async (params = {}) => {
    try {
      const data = await api.getTransactions(params);
      setTransactions(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (payload) => {
    await api.addTransaction(payload);
    await load();
  };

  const handleEditSave = async (payload) => {
    await api.updateTransaction(editing.id, payload);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id) => {
    await api.deleteTransaction(id);
    await load();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load(search ? { search } : {});
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-lg font-semibold text-gray-900">Transactions</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md">Search</button>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="bg-white border border-gray-200 rounded-lg px-4">
          <TransactionList transactions={transactions} onEdit={setEditing} onDelete={handleDelete} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-900 mb-2">{editing ? "Edit transaction" : "Add transaction"}</h2>
        <TransactionForm
          key={editing?.id || "new"}
          initial={editing}
          onSubmit={editing ? handleEditSave : handleAdd}
          onCancel={editing ? () => setEditing(null) : null}
        />
      </div>
    </div>
  );
}
