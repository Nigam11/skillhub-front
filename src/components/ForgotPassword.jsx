// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${API_BASE_URL}/api/reset-password/request`, { email });
      setStatus("success");

      setTimeout(() => {
        onClose(); // close modal after 2.5 sec
      }, 2500);
    } catch (error) {
      console.error("Reset error:", error);
      if (error.response?.status === 404) {
        setStatus("user-not-found");
      } else {
        setStatus("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in scale-95 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg transition-transform hover:scale-110"
        >
          ❌
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-blue-800">
           Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition font-medium ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm text-center mt-2">
              ✅ Reset link sent! Closing...
            </p>
          )}
          {status === "user-not-found" && (
            <p className="text-red-600 text-sm text-center mt-2">
              ❌ No user found with this email.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm text-center mt-2">
              ❌ Something went wrong. Try again later.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
