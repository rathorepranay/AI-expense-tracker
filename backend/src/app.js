import express from "express";
import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.route.js";
import goalRoutes from "./routes/goal.route.js";
import mlRoutes from "./routes/ml.route.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ml", mlRoutes);
export default app;
