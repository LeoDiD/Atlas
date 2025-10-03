import React, { useState } from "react";
import axios from "axios";

export default function CheckoutSidebar({ isOpen, onClose, cart }) {
  const [orderType, setOrderType] = useState("Dine In"); // Dine In or Pick Up
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
  try {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/payment/create-checkout", {
      amount: total,
      description: `Atlas Coffee Order (${orderType})`,
    });

    // ✅ Redirect user to PayMongo checkout
    window.location.href = res.data.url;
  } catch (err) {
    console.error("Checkout error:", err.response?.data || err.message);

    // Fix: display error message properly
    const errorMessage =
      err.response?.data?.error?.errors?.[0]?.detail || // PayMongo API format
      err.response?.data?.error?.message || 
      err.message || 
      "❌ Payment failed";

    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-[9999] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-[#6B4226]">Bills</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      {/* Order Type (Dine In / Pick Up) */}
      <div className="flex gap-4 px-4 py-3">
        <button
          onClick={() => setOrderType("Dine In")}
          className={`flex-1 py-2 rounded-lg ${
            orderType === "Dine In"
              ? "bg-[#F5E6D3] text-[#6B4226] font-semibold"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Dine In
        </button>
        <button
          onClick={() => setOrderType("Pick Up")}
          className={`flex-1 py-2 rounded-lg ${
            orderType === "Pick Up"
              ? "bg-[#F5E6D3] text-[#6B4226] font-semibold"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Pick Up
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white p-3 rounded-lg shadow"
          >
            {/* Coffee Image */}
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F5E6D3]">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-gray-500">
                {item.size} • {item.sugar}
              </p>
              {item.addons?.length > 0 && (
                <p className="text-xs text-gray-400">
                  Add-ons: {item.addons.join(", ")}
                </p>
              )}
              <p className="text-sm font-bold text-[#6B4226]">₱{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals + Checkout */}
      <div className="p-4 border-t">
        <div className="flex justify-between mb-3">
          <span className="text-gray-600">Totals</span>
          <span className="text-green-600 font-semibold">₱{total}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading || cart.length === 0}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading || cart.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#6B4226] text-white hover:bg-[#55331f]"
          }`}
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
