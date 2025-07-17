// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const ResetPassword = () => {
  const [form, setForm] = useState({ token: "", newPassword: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${API_BASE_URL}/api/reset-password/confirm`, form);
      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      console.error("Reset error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-md w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          🔒 Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reset Token
            </label>
            <input
              type="text"
              name="token"
              value={form.token}
              onChange={handleChange}
              required
              placeholder="Paste token here"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-medium transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm text-center mt-2 animate-fade-in">
              ✅ Password reset successfully! Redirecting to login...
            </p>
          )}

          {status === "error" && (
            <p className="text-red-600 text-sm text-center mt-2 animate-fade-in">
              ❌ Invalid token or server error. Try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
