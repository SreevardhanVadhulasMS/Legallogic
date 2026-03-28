import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId; // ✅ fixed
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId; // ✅ fixed
    if (!userId) return res.status(401).json({ message: "Unauthorized: no userId in token" });

    const { description, category, amount, date, status } = req.body;
    const expense = new Expense({ userId, description, category, amount, date, status });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error saving expense" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId; // ✅ fixed
    const { description, category, amount, date, status } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId },
      { description, category, amount, date, status },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId; // ✅ fixed
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId; // ✅ fixed
    const expenses = await Expense.find({ userId });
    const totalSpent = expenses.filter(e => e.status === "paid").reduce((sum, e) => sum + e.amount, 0);
    const totalPending = expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = 500000;
    res.json({
      totalSpent,
      totalPending,
      totalBudget,
      budgetUsedPercent: Math.round((totalSpent / totalBudget) * 100)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;