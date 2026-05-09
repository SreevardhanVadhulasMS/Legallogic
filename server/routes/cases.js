import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Case from "../models/Case.js";
import { analyzeCaseViability } from "../models/mlClassifier.js";

const router = express.Router();

/* =====================================================
   POST /api/cases
   Create new case + run ML analysis
===================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "Text content is required for analysis." });
    }

    // Run ML
    const result = analyzeCaseViability(text);

    // Generate case count
    const count = await Case.countDocuments({
      user: req.user.userId,
    });

    const newCaseId = `#CASE-${String(count + 1).padStart(3, "0")}`;

    // Short title
    const words = text.trim().split(" ");
    const title = words.slice(0, 5).join(" ") + "...";

    // Next action logic
    let nextAction = "Draft Legal Notice";

    if (result.status === "needs-more") {
      nextAction = "Upload Additional Docs";
    }

    if (result.status === "ready") {
      nextAction = "Book Advisor Consultation";
    }

    // Progress estimate
    let progress = 40;

    if (result.status === "ready") progress = 68;
    if (result.status === "strong") progress = 82;

    // Create case
    const newCase = new Case({
      user: req.user.userId,
      caseId: newCaseId,
      title,
      description: text,
      viabilityScore: result.viability,
      status: result.status,
      keyPoints: result.keyPoints,
      nextAction,
      progress,

      timeline: [
        {
          event: "Case Created",
          detail: "Matter submitted for AI analysis.",
        },
        {
          event: "AI Summary Generated",
          detail: "Initial viability report prepared.",
        },
      ],
    });

    const savedCase = await newCase.save();

    res.status(201).json({
      message: "Case created successfully",
      ...savedCase._doc,
    });
  } catch (error) {
    console.error("Create case error:", error);
    res.status(500).json({
      message: "Server error creating case",
      error: error.message,
    });
  }
});

/* =====================================================
   GET /api/cases
   Fetch all user cases
===================================================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cases = await Case.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error("Fetch cases error:", error);
    res.status(500).json({
      message: "Failed to fetch cases",
    });
  }
});

/* =====================================================
   GET /api/cases/:id
   Single case details
===================================================== */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (caseItem.user.toString() !== req.user.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    res.json(caseItem);
  } catch (error) {
    console.error("Single case fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch case",
    });
  }
});

/* =====================================================
   POST /api/cases/:id/notes
   Add quick note
===================================================== */
router.post("/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Note text is required",
      });
    }

    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (caseItem.user.toString() !== req.user.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    caseItem.notes.unshift({
      text,
    });

    caseItem.timeline.unshift({
      event: "Note Added",
      detail: text,
    });

    await caseItem.save();

    res.json({
      message: "Note saved successfully",
      notes: caseItem.notes,
    });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({
      message: "Failed to save note",
    });
  }
});

/* =====================================================
   GET /api/cases/:id/notes
===================================================== */
router.get("/:id/notes", authMiddleware, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.json(caseItem.notes);
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});

/* =====================================================
   POST /api/cases/:id/schedule
===================================================== */
router.post("/:id/schedule", authMiddleware, async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (caseItem.user.toString() !== req.user.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    caseItem.schedule.unshift({
      title: title || "Hearing",
      date,
    });

    caseItem.timeline.unshift({
      event: "Hearing Scheduled",
      detail: `${title || "Hearing"} scheduled.`,
    });

    // Progress boost
    caseItem.progress = Math.min(caseItem.progress + 8, 100);

    await caseItem.save();

    res.json({
      message: "Schedule added successfully",
      schedule: caseItem.schedule,
    });
  } catch (error) {
    console.error("Schedule error:", error);
    res.status(500).json({
      message: "Failed to schedule hearing",
    });
  }
});

/* =====================================================
   GET /api/cases/:id/schedule
===================================================== */
router.get("/:id/schedule", authMiddleware, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.json(caseItem.schedule);
  } catch (error) {
    console.error("Fetch schedule error:", error);
    res.status(500).json({
      message: "Failed to fetch schedule",
    });
  }
});

/* =====================================================
   DELETE /api/cases/:id
===================================================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (caseItem.user.toString() !== req.user.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await caseItem.deleteOne();

    res.json({
      message: "Case deleted successfully",
    });
  } catch (error) {
    console.error("Delete case error:", error);
    res.status(500).json({
      message: "Failed to delete case",
    });
  }
});

export default router;