import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HeroSection from "./components/HeroSection";
import FeaturedSection from "./components/FeaturedSection";
import AboutSection from "./components/AboutSection";
import FooterSection from "./components/FooterSection";
import TopBar from "./pages/TopBar";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import MenuCategoryPage from "./pages/MenuCategoryPage";
import Orders from "./pages/Order";
import PaymentFailed from "./pages/PaymentFailed";
import Profile from "./pages/Profile";
import Photobooth from "./pages/Photobooth";

import Dashboard from "./pages/Admin/Dashboard";
import AdminCoffeeOrders from "./pages/Admin/AdminCoffeeOrders";
import Analytics from "./pages/Admin/Analytics";
import Products from "./pages/Admin/Products";
import Customers from "./pages/Admin/Customers";

import Chatbot from "./components/Chatbot";

/* -------------------------
   Protect Admin Pages
-------------------------- */
const PrivateAdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/login" />;
};

/* -------------------------
   App Content
-------------------------- */
function AppContent() {
  const location = useLocation();

  // Routes where TopBar and Chatbot are hidden
  const hideTopBarRoutes = [
    "/login",
    "/signup",
    "/",
    "/admin",
    "/admin/orders",
    "/admin/products",
    "/admin/customers",
    "/admin/analytics",
    "/photobooth",
  ];

  const hideChatbotRoutes = [
    "/login",
    "/signup",
    "/",
    "/admin",
    "/payment-failed",
    "/photobooth",
  ];

  const shouldShowTopBar = !hideTopBarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  const shouldShowChatbot = !hideChatbotRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-[#E2E1E6] relative">
      {/* ✅ Render TopBar only once */}
      {shouldShowTopBar && <TopBar />}

      <Routes>
        {/* 🏠 Landing Page */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <FeaturedSection />
              <AboutSection />
              <FooterSection />
            </>
          }
        />

        {/* 👤 User Pages */}
        <Route path="/home" element={<Navigate to="/menu/Coffee" replace />} />
        <Route path="/menu/:category" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/photobooth" element={<Photobooth />} />

        {/* 💳 Payment */}
        <Route path="/payment-failed" element={<PaymentFailed />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ⚙️ Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <Dashboard />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateAdminRoute>
              <AdminCoffeeOrders />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateAdminRoute>
              <Products />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateAdminRoute>
              <Customers />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <PrivateAdminRoute>
              <Analytics />
            </PrivateAdminRoute>
          }
        />

        {/* 🧭 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 🤖 Chatbot */}
      {shouldShowChatbot && <Chatbot />}
    </div>
  );
}

/* -------------------------
   Main App Wrapper
-------------------------- */
export default function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppContent />
    </Router>
  );
}
