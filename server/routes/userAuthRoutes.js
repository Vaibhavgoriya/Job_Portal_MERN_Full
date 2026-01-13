import express from "express";
import { registerUser, loginUser } from "../controllers/userAuthController.js";

import {
  userSendOtp,
  userVerifyOtp,
  userResetPassword,
} from "../controllers/userForgotPasswordController.js";

const router = express.Router();

// 🔽 ADD ONLY
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", userSendOtp);
router.post("/verify-otp", userVerifyOtp);
router.post("/reset-password", userResetPassword);

export default router;






