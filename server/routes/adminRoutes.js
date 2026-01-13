import express from "express";
const router = express.Router();

import adminAuth from "../middleware/adminAuthMiddleware.js";
import { getAllApplications, addJobByAdmin, editJobByAdmin, deleteJobByAdmin } from "../controllers/adminController.js";
import { approveApplication, rejectApplication } from "../controllers/adminController.js";

router.get("/applications", adminAuth, getAllApplications);
router.post("/jobs", adminAuth, addJobByAdmin);
router.put("/jobs/:id", adminAuth, editJobByAdmin);
// TEMP TEST: unauthenticated route to test payload behaviour (remove after debugging)
router.put("/test/jobs/:id", editJobByAdmin);
router.delete("/jobs/:id", adminAuth, deleteJobByAdmin);

// Approve/Reject application endpoints
router.post("/applications/approve", adminAuth, approveApplication);
router.post("/applications/reject", adminAuth, rejectApplication);

export default router;
