import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = res.data;

      // ✅ Save all relevant data to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email); // ✅ Added email

      // ✅ Save full user object for other pages (like checkout)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
          token: data.token,
        })
      );

      // ✅ Redirect based on role
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Invalid email or password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E2E1E6] p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-[#6B4226] mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-[#6B4226] mb-1">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Sign in to continue your coffee journey ☕
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4226] text-white py-2.5 rounded-lg font-semibold text-base hover:bg-[#55331f] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "LOGIN"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-5 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold hover:underline text-[#6B4226]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
