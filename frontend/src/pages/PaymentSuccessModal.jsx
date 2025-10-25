// components/PaymentSuccessModal.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessModal({ open, onClose, navigate }) {
  useEffect(() => {
    if (!open) return;
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    if (!orderData) return;

    let cancelled = false;
    (async () => {
      try {
        await axios.post("http://localhost:5000/api/payment/confirm", orderData);
        if (!cancelled) {
          localStorage.removeItem("latestOrder");
          // ❌ no redirect — just leave the modal open (or auto-close if you want)
          // setTimeout(() => onClose?.(), 1500); // ← uncomment to auto-close after 1.5s
        }
      } catch (err) {
        console.error("❌ Failed to save order:", err);
      }
    })();

    return () => { cancelled = true; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-[90%] max-w-sm rounded-2xl shadow-2xl border border-gray-200 p-6 text-center">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Payment Successful!</h2>
        <p className="mt-1 text-sm text-gray-600">Your order has been recorded.</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#6B4226] hover:bg-[#5b381f]"
          >
            Close
          </button>

          {/* Optional: manual link to orders */}
          {navigate && (
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              View orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
