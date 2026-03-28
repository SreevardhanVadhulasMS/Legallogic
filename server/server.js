import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js"; // ✅ added back

process.env.MONGODB_URI = "mongodb://localhost:27017/legal-logic";
process.env.JWT_SECRET = "super-secret-jwt-key-legallogic-2025";
process.env.GOOGLE_CLIENT_ID = "your-google-client-id-here";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes); // ✅ added back

app.get("/", (req, res) => {
  res.send("LegalLogic API running ⚖️");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});