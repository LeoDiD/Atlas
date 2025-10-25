import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully! Redirecting to login...");
      // redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed. Please try again.");
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
          Join Atlas Coffee
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Create your account and start your journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Fields (Side by side) */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-3 py-2 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-3 py-2 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70"
              />
            </div>
          </div>

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
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-3 py-2 border border-[#6B4226] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4226]/70 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 rounded border-[#6B4226] text-[#6B4226] focus:ring-[#6B4226]"
              />
              <span className="text-xs text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-[#6B4226] hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#6B4226] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Sign Up button */}
          <button
            type="submit"
            className="w-full bg-[#6B4226] text-white py-2.5 rounded-lg font-semibold text-base hover:bg-[#55331f] transition"
          >
            SIGN UP
          </button>
        </form>

        {/* Login link */}
        <p className="mt-5 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline text-[#6B4226]"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
