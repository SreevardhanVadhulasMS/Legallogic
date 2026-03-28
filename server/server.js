import express from "express";
import cors from "cors"; // Nodemon triggered
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import mlRoutes from "./routes/ml.js";
import caseRoutes from "./routes/cases.js";

dotenv.config();

const app = express();

/* Connect database */
connectDB();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/cases", caseRoutes);

app.get("/", (req, res) => {
  res.send("LegalLogic API running ⚖️");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});