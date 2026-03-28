import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Attorney Fees", "Court Fees", "Expert Fees", "Document Prep", "Travel", "Other"]
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["paid", "pending"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;