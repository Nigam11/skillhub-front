// src/components/LoginModal.jsx
import { useState } from "react";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";

const API_BASE_URL = "http://localhost:8080";

const LoginModal = ({ onClose, onLoginSuccess, openSignup }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
        <div className="bg-white text-black rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in animate-slide-up scale-95">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg transition-transform hover:scale-110"
          >
            ❌
          </button>

          <h2 className="text-2xl font-bold text-center mb-4">Login to SkillHub</h2>
          {error && <div className="text-red-600 text-sm text-center mb-2">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="text-right text-sm">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <button
              onClick={openSignup}
              className="text-blue-600 hover:underline transition-all"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </>
  );
};

export default LoginModal;
