// models/Order.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  price: Number,
  size: String,
  sugar: String,
  addons: [String],
});

const OrderSchema = new mongoose.Schema(
  {
    checkoutId: { type: String, unique: true, sparse: true }, // Prevent duplicate orders
    customerEmail: { type: String, default: "N/A" }, // 👈 simplified field
    items: [ItemSchema],
    totalAmount: Number,
    orderType: String,
    paymentStatus: { type: String, default: "Paid" },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
