import express from "express";
import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.route.js"
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/expenses",expenseRoutes);
export default app;
