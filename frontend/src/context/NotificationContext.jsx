import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [seenOrderIds, setSeenOrderIds] = useState(new Set());

  // Poll for new pending orders every 5 seconds
  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        console.log("🔔 Checking for pending orders...");
        // Get all pending orders (no time filter)
        const response = await axios.get(`http://localhost:5000/api/orders?status=Pending`);
        const pendingOrders = response.data.filter(order => order.status === "Pending");

        console.log("📦 Total pending orders:", pendingOrders.length);

        // Filter out orders we've already seen
        const unseenOrders = pendingOrders.filter(order => !seenOrderIds.has(order._id));

        if (unseenOrders.length > 0) {
          console.log("✨ Found", unseenOrders.length, "NEW pending orders!");
          
          // Add new notifications with unique IDs
          const newNotifications = unseenOrders.map((order, index) => ({
            id: `${order._id}-${Date.now()}-${index}`, // Ensure unique ID
            orderId: order._id, // Keep original order ID for reference
            type: "new_order",
            message: `New order from ${order.customerEmail}`,
            amount: order.totalAmount,
            time: order.createdAt,
            read: false,
            order: order
          }));

          setNotifications(prev => [...newNotifications, ...prev]);
          setUnreadCount(prev => prev + unseenOrders.length);
          
          // Mark these orders as seen
          setSeenOrderIds(prev => {
            const newSet = new Set(prev);
            unseenOrders.forEach(order => newSet.add(order._id));
            return newSet;
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch orders:", error.response?.data || error.message);
      }
    };

    // Check if user is admin before polling
    const role = localStorage.getItem("role");
    if (role === "admin") {
      // Initial fetch
      fetchNewOrders();

      // Set up polling interval (every 5 seconds)
      const interval = setInterval(fetchNewOrders, 5000);

      return () => clearInterval(interval);
    }
  }, [seenOrderIds]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setSeenOrderIds(new Set());
  };

  const refreshNotifications = () => {
    // Clear seen orders to re-check all pending orders
    setSeenOrderIds(new Set());
    console.log("🔄 Manually refreshing notifications...");
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
