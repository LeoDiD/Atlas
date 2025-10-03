import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menuRoutes.js";
import coffeeRoutes from "./routes/coffee.js"; // ✅ coffee routes
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/coffees", coffeeRoutes); // ✅ now works
app.use("/api/payment", paymentRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
