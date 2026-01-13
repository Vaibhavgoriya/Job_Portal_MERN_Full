import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { getIO } from "../utils/socket.js";
import sendEmail from "../utils/sendEmail.js";

/* ===============================
   EDIT JOB (ADMIN)
================================ */
export const editJobByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, company, location, jobType, salary, description } = req.body;
    const updates = { title, company, location, jobType, salary, description };

    console.log("editJobByAdmin received payload:", req.body);
    console.log("editJobByAdmin applying updates:", updates);

    const job = await Job.findByIdAndUpdate(jobId, updates, { new: true, runValidators: true, omitUndefined: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    console.log("editJobByAdmin updated job:", job);

    // emit update to users
    try {
      const io = getIO();
      console.log("Emitting updateJob (admin edited)", { jobId: job._id });
      io.to("users").emit("updateJob", job);
      console.log("updateJob emitted (admin edited)");
    } catch (err) {
      console.warn("Socket not available to emit updateJob (admin)", err.message);
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJobByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    try {
      const io = getIO();
      console.log("Emitting deleteJob (admin deleted)", { jobId });
      io.to("users").emit("deleteJob", { _id: jobId });
      console.log("deleteJob emitted (admin deleted)");
    } catch (err) {
      console.warn("Socket not available to emit deleteJob (admin)", err.message);
    }

    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL APPLICATIONS (ADMIN)
================================ */
export const getAllApplications = async (req, res) => {
  try {
    console.log("getAllApplications called", { authHeader: req.headers.authorization });
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("jobId", "title company");

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
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADD JOB (ADMIN)
================================ */
export const addJobByAdmin = async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      description,
    });

    await job.save();

    // emit new job to users so they see it in real-time
    try {
      const io = getIO();
      console.log("Emitting newJob (admin added)", { jobId: job._id });
      io.to("users").emit("newJob", job);
      console.log("newJob emitted (admin added)");
    } catch (err) {
      console.warn("Socket not available to emit newJob (admin)", err.message);
    }

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve application and send email
export const approveApplication = async (req, res) => {
        console.log("ApproveApplication req.body:", req.body);
        if (!req.body.applicationId) {
          console.error("ApproveApplication error: applicationId missing");
          return res.status(400).json({ message: "applicationId missing" });
        }
    console.log("ApproveApplication req.body:", req.body);
  try {
    const { applicationId, userEmail } = req.body;
    // Update application status in DB
    await Application.findByIdAndUpdate(applicationId, { status: "approved" }, { new: true });
    await sendEmail(
      userEmail,
      "Interview Selection - Job Portal",
      "Congratulations, you are selected for the interview round, and tomorrow your interview will be in online mode."
    );
    res.json({ message: "Approval email sent." });
  } catch (error) {
    console.error("ApproveApplication error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reject application and send email
export const rejectApplication = async (req, res) => {
        if (!req.body.applicationId) {
          console.error("RejectApplication error: applicationId missing");
          return res.status(400).json({ message: "applicationId missing" });
        }
    console.log("RejectApplication req.body:", req.body);
  try {
    const { applicationId, userEmail } = req.body;
    // Update application status in DB
    await Application.findByIdAndUpdate(applicationId, { status: "rejected" }, { new: true });
    await sendEmail(
      userEmail,
      "Application Update - Job Portal",
      "Sorry, you are not selected for the next round."
    );
    res.json({ message: "Rejection email sent." });
  } catch (error) {
    console.error("RejectApplication error:", error);
    res.status(500).json({ message: error.message });
  }
};
