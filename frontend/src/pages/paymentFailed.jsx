import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
      <h1 className="text-3xl font-bold mb-3">❌ Payment Failed</h1>
      <p className="text-lg mb-4">Something went wrong. Please try again.</p>
      <button
        onClick={() => navigate("/menu")}
        className="bg-[#6B4226] text-white px-4 py-2 rounded-lg hover:bg-[#55331f]"
      >
        Back to Menu
      </button>
    </div>
  );
}
