import express from "express";
import userAuth from "../middleware/userAuthMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
  uploadResume
} from "../controllers/userProfileController.js";
import { getSavedJobs, toggleSaveJob } from "../controllers/userSavedJobsController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/profile", userAuth, getUserProfile);
// Update user profile
router.put("/profile", userAuth, updateUserProfile);
// Upload profile picture
router.post("/upload-profile-pic", userAuth, upload.single("profilePic"), uploadProfilePic);
// Upload resume
router.post("/upload-resume", userAuth, upload.single("resume"), uploadResume);


// Saved Jobs routes
router.get("/saved-jobs", userAuth, getSavedJobs);
router.post("/toggle-save-job", userAuth, toggleSaveJob);

export default router;
