import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminAuthController.js";
import {
  adminSendOtp,
  adminVerifyOtp,
  adminResetPassword,
} from "../controllers/adminForgotPasswordController.js";

const router = express.Router();

// 🔽 ADD ONLY
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.post("/forgot-password", adminSendOtp);
router.post("/verify-otp", adminVerifyOtp);
router.post("/reset-password", adminResetPassword);

export default router;
