import express from "express";
const router = express.Router();
import Job from "../models/Job.js";

// ✅ GET ALL JOBS (USER + ADMIN)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// ✅ ADD JOB (ADMIN)
router.post("/add", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: "Job added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Job add failed" });
  }
});

export default router;  
  