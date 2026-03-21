import express from "express";
import { addGoal, getGoals, addProgress, deleteGoal } from "../controllers/goal.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, addGoal);
router.get("/", verifyToken, getGoals);
router.put("/:id/progress", verifyToken, addProgress);
router.delete("/:id", verifyToken, deleteGoal);

export default router;
