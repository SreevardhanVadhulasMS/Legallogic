import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Case from "../models/Case.js";
import { analyzeCaseViability } from "../models/mlClassifier.js";

const router = express.Router();

// POST /api/cases
// Create a new case and run ML analysis
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text content is required for analysis." });
    }

    // 1. Run local ML inference
    const result = analyzeCaseViability(text);

    // 2. Generate case ID and title
    const count = await Case.countDocuments({ user: req.user.userId });
    const newCaseId = `#CASE-${String(count + 1).padStart(3, '0')}`;
    const words = text.split(" ");
    const title = words.slice(0, 5).join(" ") + "..."; // Short title

    let nextAction = "Draft Legal Notice";
    if (result.status === "needs-more") nextAction = "Upload Additional Docs";
    if (result.status === "ready") nextAction = "Book Advisor Consultation";

    // 3. Save to MongoDB
    const newCase = new Case({
      user: req.user.userId,
      caseId: newCaseId,
      title: title,
      description: text,
      viabilityScore: result.viability,
      status: result.status,
      keyPoints: result.keyPoints,
      nextAction: nextAction
    });

    const savedCase = await newCase.save();

    res.status(201).json({
      message: "Case uploaded and analyzed successfully",
      ...savedCase._doc
    });

  } catch (error) {
    console.error("Case creation error:", error);
    res.status(500).json({ message: "Server error creating case", error: error.message });
  }
});

// GET /api/cases
// Fetch all cases belonging to logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    console.error("Fetch cases error:", error);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
});

// DELETE /api/cases/:id
// Delete a specific case
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (caseItem.user.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this case" });
    }

    await caseItem.deleteOne();
    res.json({ message: "Case document successfully deleted" });

  } catch (error) {
    console.error("Delete case error:", error);
    res.status(500).json({ message: "Failed to delete case" });
  }
});

export default router;
