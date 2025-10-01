import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // React Router navigation hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save JWT token in localStorage
      localStorage.setItem("token", res.data.token);

      alert("✅ Login successful!");
      console.log("User:", res.data.user);

      // ✅ Redirect to Home dashboard
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E2E1E6] p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-10">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-[#6B4226] mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-[#6B4226] mb-1">
          Atlas Coffee
        </h1>
        <p className="text-center text-gray-700 mb-8">Click. Sip. Enjoy</p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address..."
              className="w-full px-4 py-3 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70"
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password..."
              className="w-full px-4 py-3 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <a
              href="#"
              className="text-sm text-gray-600 hover:underline absolute right-0 -bottom-6"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-[#6B4226] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#55331f] transition"
          >
            LOGIN
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold hover:underline text-[#6B4226]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
