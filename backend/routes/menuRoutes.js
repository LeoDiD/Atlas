import express from "express";
import Menu from "../models/Menu.js";

const router = express.Router();

// Create a menu item
router.post("/", async (req, res) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.status(201).json({ message: "✅ Menu item created", menuItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by category
router.get("/:category", async (req, res) => {
  try {
    const items = await Menu.find({ category: req.params.category });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
