import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../utils/sendEmail.js";

/* ===============================
   ADD JOB (ADMIN)
================================ */
export const addJobByAdmin = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      description,
      technology,
      experience,
    } = req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      description,
      technology: Array.isArray(technology)
        ? technology
        : typeof technology === "string"
          ? technology
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      experience: experience ? String(experience) : "",
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   EDIT JOB (ADMIN)
================================ */
export const editJobByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      company,
      location,
      jobType,
      salary,
      description,
      technology,
      experience,
    } = req.body;

    const updates = {
      title,
      company,
      location,
      jobType,
      salary,
      description,
      technology: Array.isArray(technology)
        ? technology
        : typeof technology === "string"
          ? technology
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      experience: experience ? String(experience) : "",
    };

    const job = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
      omitUndefined: true,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   DELETE JOB (ADMIN)
================================ */
export const deleteJobByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL APPLICATIONS (ADMIN)
================================ */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("jobId", "title company");

    const result = applications.map((app) => ({
      _id: app._id,
      user: app.userId,
      job: app.jobId,
      resumeUrl: app.resume,
      createdAt: app.createdAt,
      status: app.status,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   APPROVE APPLICATION
================================ */
export const approveApplication = async (req, res) => {
  try {
    const { applicationId, userEmail } = req.body;

    if (!applicationId) {
      return res.status(400).json({ message: "applicationId missing" });
    }

    await Application.findByIdAndUpdate(applicationId, { status: "approved" });

    await sendEmail(
      userEmail,
      "Interview Selection - Job Portal",
      "Congratulations! You are selected for the interview round. Your interview will be online.",
    );

    res.json({ message: "Approval email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   REJECT APPLICATION
================================ */
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId, userEmail } = req.body;

    if (!applicationId) {
      return res.status(400).json({ message: "applicationId missing" });
    }

    await Application.findByIdAndUpdate(applicationId, { status: "rejected" });

    await sendEmail(
      userEmail,
      "Application Update - Job Portal",
      "Sorry, you were not selected for the next round.",
    );

    res.json({ message: "Rejection email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
