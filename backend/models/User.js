import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🟢 New role field
    role: {
      type: String,
      enum: ["user", "admin", "customer"],
      default: "user",
    },

    // 🟢 Optional: track when the user was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // removes the "__v" field from Mongo
);

export default mongoose.model("User", userSchema);
