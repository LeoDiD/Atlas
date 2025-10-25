// models/menu.js
import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Coffee", "Cold Brew", "Frappe", "Pastry", "Tea"],
      required: true,
    },
    image: {
      type: String, // store image path or URL
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
