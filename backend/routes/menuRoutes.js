import express from "express";
import multer from "multer";
import path from "path";
import Menu from "../models/menu.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

/**
 * @route   POST /api/menu
 * @desc    Create a new menu item
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }

    // Get the uploaded file path
    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    const menuItem = new Menu({
      name,
      description,
      price: Number(price),
      category,
      image: imagePath,
    });

    await menuItem.save();

    res.status(201).json({ message: "✅ Menu item created successfully", menuItem });
  } catch (err) {
    console.error("❌ Error creating menu item:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/menu
 * @desc    Get all menu items OR filter by category (?category=Coffee)
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    console.log("🔍 Fetching menu - Category filter:", category || "ALL");
    const filter = category ? { category } : {};
    const items = await Menu.find(filter);
    console.log("✅ Found", items.length, "items for category:", category || "ALL");
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching menu items:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/menu/:category
 * @desc    Get items by category (legacy support)
 */
router.get("/:category", async (req, res) => {
  try {
    const items = await Menu.find({ category: req.params.category });
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching menu by category:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PATCH /api/menu/:id
 * @desc    Update a menu item (including category change and availability)
 */
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (available !== undefined) updateData.available = available;
    
    // If new image uploaded, update image path
    if (req.file) {
      updateData.image = `/images/${req.file.filename}`;
    }

    const updatedItem = await Menu.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    console.log("✅ Updated menu item:", updatedItem.name, "→ Category:", updatedItem.category, "→ Available:", updatedItem.available);
    res.json({ message: "✅ Menu item updated successfully", menuItem: updatedItem });
  } catch (err) {
    console.error("❌ Error updating menu item:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/menu/:id
 * @desc    Delete a menu item
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    console.log("🗑️ Deleted menu item:", deletedItem.name);
    res.json({ message: "✅ Menu item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting menu item:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
