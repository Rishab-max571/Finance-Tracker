import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-gray-900">
          Finance Tracker
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
