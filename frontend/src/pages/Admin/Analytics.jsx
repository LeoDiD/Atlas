import React, { useEffect, useState } from "react";
import SidebarDB from "./components/SidebarDB";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Coffee,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Download,
  FileText,
  Table,
} from "lucide-react";
import axios from "axios";
import NotificationBell from "./components/NotificationBell";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


export default function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [kpiCards, setKpiCards] = useState([
    { title: "Daily Revenue", value: 0, icon: DollarSign, prefix: "₱", period: "Today" },
    { title: "Weekly Orders", value: 0, icon: Coffee, prefix: "", period: "This Week" },
    { title: "Monthly Orders", value: 0, icon: TrendingUp, prefix: "", period: "This Month" },
    { title: "Total Customers", value: 0, icon: Users, prefix: "", period: "All Time" },
  ]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#6B4226", "#E6B980", "#B68D40", "#A47148", "#D9A679"];

  /* ---------------- Download Functions ---------------- */
  const downloadCSV = (data, filename) => {
    try {
      if (!data || data.length === 0) {
        alert("No data to download");
        return;
      }
      
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("CSV Download Error:", error);
      alert("Failed to download CSV");
    }
  };

  const downloadXLSX = (data, filename) => {
    try {
      if (!data || data.length === 0) {
        alert("No data to download");
        return;
      }
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("XLSX Download Error:", error);
      alert("Failed to download Excel file");
    }
  };

  const downloadPDF = (data, headers, title, filename) => {
    try {
      if (!data || data.length === 0) {
        alert("No data to download");
        return;
      }
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(title, 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
      
      // Create table data - handle both string headers and object headers
      const tableHeaders = headers.map(h => {
        if (typeof h === 'string') return h;
        return h.label || h.key || h;
      });
      
      const tableData = data.map(row => {
        return headers.map(h => {
          const key = typeof h === 'string' ? h : (h.key || h);
          return String(row[key] || '');
        });
      });
      
      // Use autoTable (imported separately)
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [107, 66, 38] }, // Coffee brown color
        styles: { fontSize: 9 }
      });
      
      doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF");
    }
  };

  /* ---------------- Load real data from API ---------------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Fetch orders and menu
        const [ordersRes, menuRes] = await Promise.all([
          axios.get("http://localhost:5000/api/orders"),
          axios.get("http://localhost:5000/api/menu"),
        ]);

        const orders = ordersRes.data;
        const menu = menuRes.data;

        // Helper functions for date filtering
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isToday = (date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        };

        const isThisWeek = (date) => {
          const d = new Date(date);
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return d >= weekAgo;
        };

        const isThisMonth = (date) => {
          const d = new Date(date);
          return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
        };

        // Calculate KPIs
        const todayOrders = orders.filter(o => isToday(o.createdAt) && o.paymentStatus === "Paid");
        const dailyRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        const weeklyOrders = orders.filter(o => isThisWeek(o.createdAt) && o.paymentStatus === "Paid");
        const weeklyRevenue = weeklyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        const monthlyOrders = orders.filter(o => isThisMonth(o.createdAt) && o.paymentStatus === "Paid");
        const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        // Annual revenue (this year)
        const thisYear = today.getFullYear();
        const annualOrders = orders.filter(o => {
          const d = new Date(o.createdAt);
          return d.getFullYear() === thisYear && o.paymentStatus === "Paid";
        });
        const annualRevenue = annualOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setKpiCards([
          { title: "Daily Revenue", value: dailyRevenue, icon: DollarSign, prefix: "₱", period: "Today" },
          { title: "Weekly Revenue", value: weeklyRevenue, icon: Coffee, prefix: "₱", period: "This Week" },
          { title: "Monthly Revenue", value: monthlyRevenue, icon: TrendingUp, prefix: "₱", period: "This Month" },
          { title: "Annual Revenue", value: annualRevenue, icon: Users, prefix: "₱", period: "This Year" },
        ]);

        // Sales Overview - Last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayOrders = orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === date.getTime() && o.paymentStatus === "Paid";
          });
          const total = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          last7Days.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            total: Math.round(total)
          });
        }
        setSalesData(last7Days);

        // Top Products - Count items across all orders
        const productCounts = {};
        orders.forEach(order => {
          (order.items || []).forEach(item => {
            productCounts[item.name] = (productCounts[item.name] || 0) + (item.qty || 1);
          });
        });
        const topProductsData = Object.entries(productCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, orders]) => ({ name, orders }));
        setTopProducts(topProductsData);

        // Payment Methods - Mock data (you can enhance this if you have paymentMethod field)
        const paidOrders = orders.filter(o => o.paymentStatus === "Paid");
        setPaymentMethods([
          { name: "GCash", value: Math.round(paidOrders.length * 0.6) },
          { name: "Card", value: Math.round(paidOrders.length * 0.25) },
          { name: "PayMaya", value: Math.round(paidOrders.length * 0.15) },
        ]);

        // Order Status
        const statusCounts = orders.reduce((acc, order) => {
          const status = order.status || "Pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
        setOrderStatus(orderStatusData);

        // Category Performance - Count items by category
        const categoryCounts = {};
        orders.forEach(order => {
          (order.items || []).forEach(item => {
            // Find the product in menu to get its category
            const product = menu.find(p => p.name === item.name);
            const category = product?.category || "Other";
            categoryCounts[category] = (categoryCounts[category] || 0) + (item.qty || 1);
          });
        });
        const categoryData = Object.entries(categoryCounts).map(([category, total]) => ({ category, total }));
        setCategoryPerformance(categoryData);

        // Peak Hours - Group orders by hour
        const hourCounts = {};
        orders.forEach(order => {
          const hour = new Date(order.createdAt).getHours();
          const hourLabel = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour === 0 ? 12 : hour} AM`;
          hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1;
        });
        
        // Get top 6 peak hours
        const peakHoursData = Object.entries(hourCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([hour, orders]) => ({ hour, orders }))
          .sort((a, b) => {
            const timeA = a.hour.includes('AM') ? parseInt(a.hour) : parseInt(a.hour) + 12;
            const timeB = b.hour.includes('AM') ? parseInt(b.hour) : parseInt(b.hour) + 12;
            return timeA - timeB;
          });
        setPeakHours(peakHoursData);

      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#E2E1E6]">
      <SidebarDB />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto ml-20">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#6B4226]/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-[#6B4226]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Analytics Overview
              </h1>
              <p className="text-xs text-gray-500">
                Track your sales, orders, and customer trends
              </p>
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpiCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{card.title}</span>
                  <IconComponent className="h-4 w-4 text-[#6B4226]" />
                </div>
                <p className="text-2xl font-bold text-[#6B4226]">
                  {card.prefix}
                  {card.value.toLocaleString()}
                </p>
                <span className="text-xs text-gray-400">{card.period}</span>
              </div>
            );
          })}
        </div>

        {/* Sales Overview */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold text-[#6B4226]">
              Sales Overview (Last 7 Days)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(salesData, 'sales-overview')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download CSV"
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadXLSX(salesData, 'sales-overview')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download XLSX"
              >
                <Table className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadPDF(salesData, [
                  { key: 'date', label: 'Date' },
                  { key: 'total', label: 'Revenue (₱)' }
                ], 'Sales Overview - Last 7 Days', 'sales-overview')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B4226]"></div>
            </div>
          ) : salesData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No sales data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B4226" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6B4226" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6B4226"
                  fillOpacity={1}
                  fill="url(#salesColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Top Products */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold text-[#6B4226]">
              Top Selling Products
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(topProducts, 'top-products')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download CSV"
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadXLSX(topProducts, 'top-products')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download XLSX"
              >
                <Table className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadPDF(topProducts, [
                  { key: 'name', label: 'Product Name' },
                  { key: 'orders', label: 'Orders' }
                ], 'Top Selling Products', 'top-products')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B4226]"></div>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No product data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="orders" fill="#6B4226" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Payment Methods + Order Status */}
        <div className="grid sm:grid-cols-2 gap-5">
          <section className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-semibold text-[#6B4226]">
                Payment Method Breakdown
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadCSV(paymentMethods, 'payment-methods')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download CSV"
                >
                  <FileText className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => downloadXLSX(paymentMethods, 'payment-methods')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download XLSX"
                >
                  <Table className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => downloadPDF(paymentMethods, [
                    { key: 'name', label: 'Payment Method' },
                    { key: 'value', label: 'Count' }
                  ], 'Payment Method Breakdown', 'payment-methods')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>

          <section className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-semibold text-[#6B4226]">
                Order Status Summary
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadCSV(orderStatus, 'order-status')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download CSV"
                >
                  <FileText className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => downloadXLSX(orderStatus, 'order-status')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download XLSX"
                >
                  <Table className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => downloadPDF(orderStatus, [
                    { key: 'name', label: 'Status' },
                    { key: 'value', label: 'Count' }
                  ], 'Order Status Summary', 'order-status')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {orderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>
        </div>

        {/* Category Performance */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold text-[#6B4226]">
              Category Performance
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(categoryPerformance, 'category-performance')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download CSV"
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadXLSX(categoryPerformance, 'category-performance')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download XLSX"
              >
                <Table className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadPDF(categoryPerformance, [
                  { key: 'category', label: 'Category' },
                  { key: 'total', label: 'Total Items' }
                ], 'Category Performance', 'category-performance')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#B68D40" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Peak Order Hours */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold text-[#6B4226]">
              Peak Order Hours
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(peakHours, 'peak-hours')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download CSV"
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadXLSX(peakHours, 'peak-hours')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download XLSX"
              >
                <Table className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => downloadPDF(peakHours, [
                  { key: 'hour', label: 'Hour' },
                  { key: 'orders', label: 'Orders' }
                ], 'Peak Order Hours', 'peak-hours')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#6B4226" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
