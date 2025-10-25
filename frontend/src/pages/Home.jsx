import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../pages/Sidebar";
import TopBar from "../pages/TopBar";
import PaymentSuccessModal from "../pages/PaymentSuccessModal";
import MenuCard from "../components/MenuCard";
import CheckoutSidebar from "../components/CheckoutSidebar";
import Chatbot from "../components/Chatbot";

export default function Home() {
  const navigate = useNavigate();
  const { category } = useParams(); // Get category from URL params
  const location = useLocation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // 🌟 Get category from URL params (decoded)
  const activeCategory = decodeURIComponent(category || "Coffee");

  // 🧾 Fetch items dynamically when category changes (show all items including unavailable)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log("🔍 Fetching menu for category:", activeCategory);
        const res = await axios.get(`http://localhost:5000/api/menu?category=${activeCategory}`);
        // Show all items (available and unavailable)
        console.log("✅ Menu items loaded:", res.data.length, "(showing all items)");
        setMenuItems(res.data);
      } catch (error) {
        console.error("❌ Failed to load menu:", error);
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, [activeCategory]);

  // 💳 Finalize order success (only once)
  useEffect(() => {
    const finalizeOrder = async () => {
      // Prevent duplicate order confirmation
      if (orderConfirmed) {
        console.log("⚠️ Order already confirmed, skipping...");
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const checkoutId = params.get("checkout_id");

        const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
        const customerEmail = currentUser.email || latestOrder?.customerEmail || "guest@example.com";

        if (checkoutId && latestOrder) {
          console.log("📦 Confirming order with checkout ID:", checkoutId);
          
          await axios.post("http://localhost:5000/api/payment/confirm", {
            checkoutId,
            cart: latestOrder.cart,
            totalAmount: latestOrder.totalAmount,
            orderType: latestOrder.orderType,
            customerEmail,
          });

          console.log("✅ Order confirmed successfully!");
          localStorage.removeItem("latestOrder");
          setOrderConfirmed(true);
          setShowSuccess(true);
          window.history.replaceState({}, document.title, "/menu/Coffee");
        } else if (localStorage.getItem("latestOrder")) {
          setShowSuccess(true);
        }
      } catch (error) {
        console.error("❌ Failed to confirm order:", error.response?.data || error.message);
      }
    };
    
    finalizeOrder();
  }, []); // Run only once on mount

  // 🛒 Add to cart
  const handleAddToCart = (item) => {
    setCart((c) => [...c, item]);
    setCheckoutOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#E2E1E6]">
      {/* Top Navigation */}
      <TopBar />

      {/* Main content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main menu area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-[#6B4226] mb-6">
            {activeCategory}
          </h1>

          {menuItems.length === 0 ? (
            <p className="text-gray-500">No items found for this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <MenuCard key={item._id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Checkout Sidebar */}
      <CheckoutSidebar
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        setCart={setCart}
      />

      {/* Payment Success */}
      <PaymentSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        navigate={navigate}
      />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
