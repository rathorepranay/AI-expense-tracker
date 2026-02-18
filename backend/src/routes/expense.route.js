import express, { Router } from "express";
import { addExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expense.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/',verifyToken, addExpense);
router.get('/', verifyToken, getExpenses);
router.put('/:id', verifyToken, updateExpense);
router.delete('/:id', verifyToken, deleteExpense);

export default router;

