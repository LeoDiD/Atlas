// routes/orders.js
import express from "express";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* -------------------------------------------
   1️⃣ Nodemailer transporter setup
------------------------------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your App Password (not your Gmail password)
  },
});

/* -------------------------------------------
   2️⃣ GET /api/orders → Fetch all orders
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    console.error("GET /api/orders failed:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

/* -------------------------------------------
   2.5️⃣ GET /api/orders/new → Fetch new orders since timestamp
------------------------------------------- */
router.get("/new", async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 60000); // Default: last 1 minute

    console.log("🔍 Checking for new orders since:", sinceDate);

    // First, let's see all pending orders
    const allPendingOrders = await Order.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    console.log(`📊 Total pending orders in DB: ${allPendingOrders.length}`);
    if (allPendingOrders.length > 0) {
      console.log("📦 Most recent pending order:", {
        id: allPendingOrders[0]._id,
        createdAt: allPendingOrders[0].createdAt,
        customer: allPendingOrders[0].customerEmail,
        amount: allPendingOrders[0].totalAmount
      });
    }

    const newOrders = await Order.find({
      createdAt: { $gt: sinceDate },
      status: "Pending" // Only get pending orders (new orders)
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${newOrders.length} new pending orders since ${sinceDate}`);

    res.json(newOrders);
  } catch (err) {
    console.error("❌ GET /api/orders/new failed:", err);
    res.status(500).json({ message: "Failed to load new orders" });
  }
});

/* -------------------------------------------
   3️⃣ PATCH /api/orders/:id/status
   Update order status & send email if completed
------------------------------------------- */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status
    order.status = status;
    await order.save();

    console.log(`✅ Order ${order._id} status updated to: ${status}`);

    // ✅ Send email if order is completed
    if (status === "Completed" && order.customerEmail) {
      const itemList = order.items
        .map(
          (i) =>
            `• ${i.qty || 1} × ${i.name} - ₱${(
              i.price * (i.qty || 1)
            ).toFixed(2)}`
        )
        .join("\n");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.customerEmail,
        subject: `☕ Your Coffee Order is Completed!`,
        text: `
Hello,

Your order has been completed successfully! 🎉

🧾 Order ID: ${order._id}
📅 Date: ${new Date(order.updatedAt).toLocaleString()}
💳 Payment: ${order.paymentStatus}
💰 Total: ₱${order.totalAmount.toFixed(2)}

🧃 Items:
${itemList}

Thank you for ordering with Atlas Coffee!
Enjoy your drink ☕
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Completion email sent to ${order.customerEmail}`);
      } catch (emailErr) {
        console.error("❌ Failed to send email:", emailErr);
        // Don't fail the whole request if email fails
      }
    }

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

/* -------------------------------------------
   4️⃣ POST /api/orders/complete/:id
   Mark order as completed & send email (Legacy - kept for compatibility)
------------------------------------------- */
router.post("/complete/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Completed";
    await order.save();

    // ✅ Send confirmation email
    if (order.customerEmail) {
      const itemList = order.items
        .map(
          (i) =>
            `• ${i.qty || 1} × ${i.name} - ₱${(
              i.price * (i.qty || 1)
            ).toFixed(2)}`
        )
        .join("\n");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.customerEmail,
        subject: `☕ Your Coffee Order is Completed!`,
        text: `
Hello,

Your order has been completed successfully! 🎉

🧾 Order ID: ${order._id}
📅 Date: ${new Date(order.updatedAt).toLocaleString()}
💳 Payment: ${order.paymentStatus}
💰 Total: ₱${order.totalAmount.toFixed(2)}

🧃 Items:
${itemList}

Thank you for ordering with Atlas Coffee!
Enjoy your drink ☕
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${order.customerEmail}`);
    }

    res.json({ message: "Order marked as completed and email sent." });
  } catch (err) {
    console.error("❌ Error completing order:", err);
    res.status(500).json({ message: "Failed to complete order" });
  }
});

export default router;
