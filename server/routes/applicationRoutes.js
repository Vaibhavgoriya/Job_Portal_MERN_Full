import express from "express";
import { updateApplicationStatus } from "../controllers/applicationController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import userAuth from "../middleware/userAuthMiddleware.js";
import {
  applyJob,
  getAllApplications,
  getMyApplications,
} from "../controllers/applicationController.js";

const router = express.Router();
router.post(
  "/apply",
  userAuth,
  upload.single("resume"),
  applyJob
);

router.get("/", getAllApplications);

// GET logged-in user's applications
router.get("/my", userAuth, getMyApplications);

router.put("/:id/status", adminAuth, updateApplicationStatus);

export default router;
