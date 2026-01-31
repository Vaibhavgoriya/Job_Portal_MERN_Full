import Application from "../models/Application.js";
import mongoose from "mongoose";
import { getIO } from "../utils/socket.js";
import sendEmail from "../utils/sendEmail.js";
import path from "path";

// ================= APPLY JOB =================
export const applyJob = async (req, res) => {
  try {
    const { jobId, resume } = req.body;
    const userId = req.user.id || req.user;

    if (!resume) {
      return res.status(400).json({ message: "Resume required" });
    }

    // No req.file check, use resume from req.body
    const application = new Application({
      jobId,
      userId,
      resume,
    });

    await application.save();

    // ✅ SAFE POPULATE
    await application.populate({
      path: "userId",
      select: "name email",
      strictPopulate: false,
    });

    await application.populate({
      path: "jobId",
      select: "title company",
      strictPopulate: false,
    });

    // Always use only the filename for resumeUrl
    const resumeFileName = path.basename(application.resume);
    const payload = {
      _id: application._id,
      user: application.userId,
      job: application.jobId,
      resumeUrl: `/uploads/resumes/${resumeFileName}`,
      createdAt: application.createdAt,
      status: application.status,
    };

    try {
      const io = getIO();
      io.to("admins").emit("newApplication", payload);
    } catch (err) {
      console.warn("Socket emit skipped:", err.message);
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: payload,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ message: "Application failed" });
  }
};

// ================= GET ALL APPLICATIONS =================
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "userId",
        select: "name email",
        strictPopulate: false,
      })
      .populate({
        path: "jobId",
        select: "title company",
        strictPopulate: false,
      });

    const result = applications.map((a) => ({
      _id: a._id,
      user: a.userId,
      job: a.jobId,
      resumeUrl: `/uploads/resumes/${a.resume}`,
      createdAt: a.createdAt,
      status: a.status,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error loading applications" });
  }
};

// ================= UPDATE STATUS (APPROVE / REJECT) =================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // ✅ VERY IMPORTANT FIX
    status = status.toLowerCase();

    const application = await Application.findById(id).populate({
      path: "userId",
      select: "name email",
      strictPopulate: false,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // 📧 SEND EMAIL
    if (status === "approved") {
      await sendEmail(
        application.userId.email,
        "Interview Selection",
        "Congratulations, you are selected for the interview round, and tomorrow your interview will be in online mode."
      );
    }

    if (status === "rejected") {
      await sendEmail(
        application.userId.email,
        "Application Update",
        "Sorry, you are not selected for the next round."
      );
    }

    res.json({ message: `Application ${status} successfully` });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Action failed" });
  }
};

// ================= GET MY APPLICATIONS (USER) =================
export const getMyApplications = async (req, res) => {
  try {
    const userIdRaw = req.user.id || req.user;
    const userId = new mongoose.Types.ObjectId(userIdRaw);

    const applications = await Application.find({ userId })
      .populate({
        path: "jobId",
        select: "title company",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 });

    const result = applications.map((a) => ({
      _id: a._id,
      job: a.jobId,
      resumeUrl: `/uploads/resumes/${a.resume}`,
      status: a.status,
      createdAt: a.createdAt,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get My Applications Error:", error);
    res.status(500).json({ message: "Failed to load applications" });
  }
};
