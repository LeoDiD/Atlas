import express from "express";
import Coffee from "../models/Coffee.js";

const router = express.Router();

// GET all coffees
router.get("/", async (req, res) => {
  try {
    const coffees = await Coffee.find();
    res.json(coffees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE coffee by ID
router.put("/:id", async (req, res) => {
  try {
    const coffee = await Coffee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(coffee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
