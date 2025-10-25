// routes/payment.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();
const router = express.Router();

/* -------------------------------
   POST /api/payment/create-checkout
   Create a PayMongo checkout session
-------------------------------- */
router.post("/create-checkout", async (req, res) => {
  try {
    const { cart, customerEmail, subtotal, vatRate, vatAmount, grandTotal } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Compute total from cart (fallback) and prefer grandTotal sent from frontend
    const computedTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const useTotal = typeof grandTotal === 'number' && !isNaN(grandTotal) ? Number(grandTotal) : computedTotal;

    console.log(`🛒 Creating PayMongo checkout for ${customerEmail || "Guest"}... Total (PHP): ${useTotal}`);

    const checkoutPayload = {
      data: {
        attributes: {
          // Send the total amount (in centavos) to PayMongo so VAT is included
          amount: Math.round(useTotal * 100),
          currency: "PHP",
          payment_method_types: ["card", "gcash", "paymaya"],
          success_url: "http://localhost:5173/home",
          cancel_url: "http://localhost:5173/payment-failed",
          customer_info: { email: customerEmail || "N/A" },
          description: `Coffee Order - ${customerEmail || "Guest"}`,
          // include metadata for easier reconcilation
          metadata: {
            subtotal: subtotal || computedTotal,
            vatRate: vatRate || 0,
            vatAmount: vatAmount || (useTotal - computedTotal),
          },
        },
      },
    };

    // Keep individual line items if PayMongo expects them for display
    if (Array.isArray(cart) && cart.length > 0) {
      const items = cart.map((item) => ({
        name: item.name,
        amount: Math.round(item.price * 100),
        currency: "PHP",
        quantity: item.quantity || 1,
      }));

      // If VAT exists (difference between useTotal and computedTotal or vatAmount provided), add it as a separate line item
      const computedVatAmount = typeof vatAmount === 'number' && !isNaN(vatAmount) ? Number(vatAmount) : Math.max(0, useTotal - computedTotal);
      const vatLineAmount = Math.round(computedVatAmount * 100);
      if (vatLineAmount > 0) {
        items.push({
          name: `VAT ${((vatRate || 0) * 100).toFixed(0)}%`,
          amount: vatLineAmount,
          currency: "PHP",
          quantity: 1,
        });
      }

      checkoutPayload.data.attributes.line_items = items;

      // Ensure top-level amount matches sum of line_items for consistency
      const sumLineItems = items.reduce((s, it) => s + (it.amount || 0) * (it.quantity || 1), 0);
      checkoutPayload.data.attributes.amount = sumLineItems;
    }

    const checkoutRes = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      checkoutPayload,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ PayMongo checkout created successfully.");
    res.json(checkoutRes.data);
  } catch (err) {
    console.error("❌ PayMongo error:", err.response?.data || err.message);
    res.status(500).json({ message: "Payment creation failed" });
  }
});

/* -------------------------------
   POST /api/payment/confirm
   Save the order after successful payment
-------------------------------- */
router.post("/confirm", async (req, res) => {
  try {
    const { checkoutId, cart, totalAmount, orderType, customerEmail } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Check if order with this checkout ID already exists (prevent duplicates)
    if (checkoutId) {
      const existingOrder = await Order.findOne({ checkoutId });
      if (existingOrder) {
        console.log(`⚠️ Order already exists for checkout ID: ${checkoutId}`);
        return res.status(200).json({
          message: "Order already exists",
          order: existingOrder,
        });
      }
    }

    // ✅ Normalize items - include size, sugar, and addons
    const items = cart.map((item) => ({
      name: item.name,
      qty: item.quantity || 1,
      price: item.price,
      size: item.size || "N/A",
      sugar: item.sugar || "N/A",
      addons: Array.isArray(item.addons) ? item.addons : [],
    }));

    // ✅ Save order
    const newOrder = new Order({
      checkoutId, // Store checkout ID to prevent duplicates
      customerEmail: customerEmail || "N/A", // ✅ only email
      items,
      totalAmount,
      orderType: orderType || "Dine In",
      paymentStatus: "Paid",
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    console.log(`✅ Order saved successfully: ${savedOrder._id}`);

    res.status(201).json({
      message: "Order saved successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ Save order error:", error);
    res.status(500).json({ message: "Failed to save order" });
  }
});

export default router;
