import express from "express";
import { getPrediction } from "../controllers/ml.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/predict", verifyToken, getPrediction);

export default router;
