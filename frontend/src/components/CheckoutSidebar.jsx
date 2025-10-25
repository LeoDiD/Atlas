import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='8' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function CheckoutSidebar({ isOpen, onClose, cart, setCart }) {
  const [orderType, setOrderType] = useState("Dine In");
  const [loading, setLoading] = useState(false);

  // Terms modal state
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // VAT config
  const VAT_RATE = 0.12; // 12% VAT

  if (!isOpen) return null;

  // 🧠 Get logged-in user info safely
  const storedUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(localStorage.getItem("user")) ||
    null;

  const currentUser = storedUser || { email: "guest@example.com" };

  // 🧮 Money helpers
  const peso = (n) => `₱${Number(n || 0).toFixed(2)}`;

  // 🧮 Compute money
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const vatAmount = subtotal * VAT_RATE;
  const grandTotal = subtotal + vatAmount;

  // ➕ Increase quantity
  const handleAdd = (index) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item
      )
    );
  };

  // ➖ Decrease quantity
  const handleMinus = (index) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 1) }
          : item
      )
    );
  };

  // 🧾 First step: open Terms modal
  const beginCheckout = () => {
    setShowTerms(true);
  };

  // 💳 Proceed after accepting Terms
  const handleCheckout = async () => {
    if (!agreed) return; // guard

    try {
      setLoading(true);

      const customerEmail = currentUser.email || "guest@example.com";

      // Save to localStorage for confirmation page
      localStorage.setItem(
        "latestOrder",
        JSON.stringify({
          cart,
          subtotal,
          vatRate: VAT_RATE,
          vatAmount,
          totalAmount: grandTotal,
          orderType,
          customerEmail,
          termsAcceptedAt: new Date().toISOString(),
        })
      );

      // Create PayMongo session
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout",
        {
          cart: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
          })),
          customerEmail,
          // Extra fields your backend can use:
          subtotal,
          vatRate: VAT_RATE,
          vatAmount,
          grandTotal,
          orderType,
          termsAccepted: true,
        }
      );

      // Redirect to PayMongo
      window.location.href = res.data.data.attributes.checkout_url;
    } catch (err) {
      alert(
        "❌ Failed to start checkout. " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-[9999] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-[#6B4226]">Bills</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Order Type */}
      <div className="flex gap-4 px-4 py-3">
        {["Dine In", "Pick Up"].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`flex-1 py-2 rounded-lg ${
              orderType === type
                ? "bg-[#F5E6D3] text-[#6B4226] font-semibold"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            🛒 Your cart is empty.
          </p>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white p-3 rounded-lg shadow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F5E6D3]">
                <img
                  src={item.image ? `${BACKEND_URL}${item.image}` : PLACEHOLDER_IMAGE}
                  alt={item.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>

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

                <p className="text-sm font-bold text-[#6B4226]">
                  {peso(item.price * (item.quantity || 1))}
                </p>

                {/* ➕➖ Quantity controls */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleMinus(index)}
                    className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="font-semibold text-gray-700">
                    {item.quantity ?? 1}
                  </span>
                  <button
                    onClick={() => handleAdd(index)}
                    className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals + Checkout */}
      <div className="p-4 border-t bg-white">
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800 font-medium">{peso(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-gray-600">VAT {(VAT_RATE * 100).toFixed(0)}%</span>
          <span className="text-gray-800 font-medium">{peso(vatAmount)}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-700 font-semibold">Grand Total</span>
          <span className="text-green-600 font-semibold">
            {peso(grandTotal)}
          </span>
        </div>

        <button
          onClick={beginCheckout}
          disabled={loading || cart.length === 0}
          className="w-full bg-[#6B4226] text-white py-3 rounded-lg hover:bg-[#55331f] transition disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Checkout"}
        </button>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          onClick={() => setShowTerms(false)}
        >
          {/* Backdrop (grayscale + dim + slight blur; does NOT blur modal) */}
          <div className="absolute inset-0 pointer-events-none bg-transparent backdrop-grayscale backdrop-brightness-75 backdrop-blur-[1.5px]" />
          <div className="absolute inset-0 pointer-events-none supports-not-[backdrop-filter]:bg-black/20" />

          {/* Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl border border-gray-200 p-5"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-sm">
                !
              </span>
              Terms & Conditions
            </h3>

            {/* Attention box to draw focus */}
            <div
              role="alert"
              className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-[15px] leading-relaxed text-amber-900"
            >
              By proceeding, you acknowledge and agree that
              <strong className="text-rose-700 font-semibold">
                {" "}
                all sales are final
              </strong>
              . There will be{" "}
              <strong className="text-rose-700 font-semibold">no refunds</strong>{" "}
              and you{" "}
              <strong className="text-rose-700 font-semibold">
                cannot cancel
              </strong>{" "}
              your order once placed.
            </div>

            {/* Checkbox – higher contrast to focus attention */}
            <label className="flex items-start gap-2 text-[14px] text-gray-800 mb-5">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#6B4226] focus:ring-2 focus:ring-[#6B4226]/30"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="leading-5">
                I have read and agree to the{" "}
                <span className="font-semibold">Terms & Conditions</span> above.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAgreed(false);
                  setShowTerms(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!agreed) return;
                  setShowTerms(false);
                  handleCheckout();
                }}
                disabled={!agreed || loading}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors ${
                  !agreed || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#6B4226] hover:bg-[#55331f]"
                }`}
              >
                {loading ? "Please wait…" : "I Agree & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
