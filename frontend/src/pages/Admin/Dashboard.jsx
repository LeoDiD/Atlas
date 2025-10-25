import React, { useEffect, useState } from "react";
import Sidebar from "./components/SidebarDB";
import RevenueChart from "./components/RevenueChart";
import RecentOrders from "./components/RecentOrders";
import AreaStats from "./components/AreaStats";
import NotificationBell from "./components/NotificationBell";
import { TrendingUp, TrendingDown, ShoppingCart, Users, Wallet, Package } from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Daily Revenue", value: "₱0", change: "+0%", positive: true, subtext: "Today", featured: true, icon: Wallet },
    { title: "Total Orders", value: "0", change: "+0%", positive: true, subtext: "All Time", icon: ShoppingCart },
    { title: "Total Customers", value: "0", change: "+0%", positive: true, subtext: "Registered", icon: Users },
    { title: "Total Products", value: "0", change: "+0%", positive: true, subtext: "In Stock", icon: Package },
  ]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch orders
        const ordersRes = await axios.get("http://localhost:5000/api/orders");
        const orders = ordersRes.data;

        // Fetch menu/products
        const menuRes = await axios.get("http://localhost:5000/api/menu");
        const products = menuRes.data;

        // Calculate daily revenue (today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime() && order.paymentStatus === "Paid";
        });
        const dailyRevenue = dailyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Calculate yesterday's revenue for comparison
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === yesterday.getTime() && order.paymentStatus === "Paid";
        });
        const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const revenueChange = yesterdayRevenue > 0 
          ? (((dailyRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
          : dailyRevenue > 0 ? "+100" : "0";

        // Total orders
        const totalOrders = orders.length;

        // Total unique customers (by email)
        const uniqueCustomers = new Set(orders.map(order => order.customerEmail)).size;

        // Total products
        const totalProducts = products.length;

        // Update stats
        setStats([
          { 
            title: "Daily Revenue", 
            value: `₱${dailyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`, 
            positive: revenueChange >= 0, 
            subtext: "Today", 
            featured: true,
            icon: Wallet
          },
          { 
            title: "Total Orders", 
            value: totalOrders.toString(), 
            change: `${dailyOrders.length} today`, 
            positive: true, 
            subtext: "All Time",
            icon: ShoppingCart
          },
          { 
            title: "Total Customers", 
            value: uniqueCustomers.toString(), 
            change: "+0%", 
            positive: true, 
            subtext: "Unique",
            icon: Users
          },
          { 
            title: "Total Products", 
            value: totalProducts.toString(), 
            change: "+0%", 
            positive: true, 
            subtext: "In Menu",
            icon: Package
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#E2E1E6]">
      <Sidebar />

      <div className="flex-1 p-6 ml-20">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#2E2E2E]">Hello, Barbara 👋</h1>
            <p className="text-sm text-gray-500">Here's what's happening in your store this month.</p>
          </div>
          <NotificationBell />
        </div>

        {/* Row 1: Stats in single row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className={`relative rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                  card.featured ? "bg-[#C18857] text-white" : "bg-white text-gray-800"
                }`}
              >
                {/* Top Right Icon */}
                <div className="absolute top-4 right-4">
                  <div className={`p-2 rounded-full ${card.featured ? "bg-white/20" : "bg-gray-100"}`}>
                    <Icon className={`w-5 h-5 ${card.featured ? "text-white" : "text-[#6B4226]"}`} />
                  </div>
                </div>

                {/* Title */}
                <p className={`text-sm font-medium mb-2 ${card.featured ? "text-white/90" : "text-gray-600"}`}>
                  {card.title}
                </p>

                {/* Value */}
                <h3 className={`text-3xl font-bold mb-3 ${card.featured ? "text-white" : "text-gray-900"}`}>
                  {card.value}
                </h3>

                {/* Bottom */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                      card.positive && card.featured
                        ? "bg-white/20 text-white"
                        : card.positive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className={`text-xs ${card.featured ? "text-white/80" : "text-gray-500"}`}>
                    {card.subtext}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: RecentOrders | AreaStats */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="w-full">
            <RecentOrders />
          </div>
          <div className="w-full">
            <AreaStats />
          </div>
        </div>
      </div>
    </div>
  );
}
