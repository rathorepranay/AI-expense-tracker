import express from 'express';
import {registerUser, verifyOTP, loginUser, deleteAccount} from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.delete('/delete', verifyToken, deleteAccount);

export default router;