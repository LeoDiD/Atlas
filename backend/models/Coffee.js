import mongoose from "mongoose";

const coffeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "/images/default-coffee.png" },
  },
  { timestamps: true }
);

// 👇 force mongoose to use "menus" collection
const Coffee = mongoose.model("Coffee", coffeeSchema, "menus");

export default Coffee;
