import express, { Router } from "express";
import {
  addExpense,
  getExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  clearAllExpenses,
} from "../controllers/expense.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, addExpense);
router.get("/", verifyToken, getExpenses);
router.delete("/clear", verifyToken, clearAllExpenses);
router.put("/:id", verifyToken, updateExpense);
router.delete("/:id", verifyToken, deleteExpense);
router.get("/:id", verifyToken, getSingleExpense);

export default router;
