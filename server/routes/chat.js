import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { askLegalAI } from "../services/geminiChatService.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const reply = await askLegalAI(message);

    res.json({
      reply,
    });
  } catch (error) {
    console.error("FULL CHAT ERROR:", error.response?.data || error.message || error);

    res.status(500).json({
      message: "Failed to process chat",
    });
  }
});
export default router;