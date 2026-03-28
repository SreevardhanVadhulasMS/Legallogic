import express from "express";
import { analyzeCaseViability } from "../models/mlClassifier.js";

const router = express.Router();

// POST /api/ml/analyze
// Accepts { text: "..." }
router.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text content is required for analysis." });
    }

    // Run inference using Python-trained weights loaded as JSON — no subprocess spawning
    const result = analyzeCaseViability(text);

    res.json({
      title: "ML Case Viability Analysis",
      ...result
    });

  } catch (error) {
    console.error("ML Analysis Error:", error);
    res.status(500).json({ message: "Server error during ML analysis", error: error.message });
  }
});

export default router;
