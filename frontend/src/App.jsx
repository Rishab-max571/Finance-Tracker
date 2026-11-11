import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";

function PrivateLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-sm text-gray-500 p-6">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateLayout>
            <Transactions />
          </PrivateLayout>
        }
      />
      <Route
        path="/budget"
        element={
          <PrivateLayout>
            <Budget />
          </PrivateLayout>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
