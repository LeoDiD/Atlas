import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menuRoutes.js";
import coffeeRoutes from "./routes/coffee.js";
import paymentRoutes from "./routes/payment.js";
import chatRoute from "./routes/chatRoute.js"; // 🟢 OpenAI Chat Route
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Serve static files (for uploaded images)
app.use("/images", express.static("public/images"));
// Also serve images from frontend/public/images for existing images
app.use("/images", express.static("../frontend/public/images"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/coffees", coffeeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoute); // ✅ Use only the OpenAI chat route
app.use("/api/orders", orderRoutes);

// 🧩 Remove old Gemini imports (chat.js, duplicate chatRoutes) from your imports above

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
