import Application from "../models/Application.js";
import mongoose from "mongoose";
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

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      userId,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = new Application({
      jobId,
      userId,
      resume,
    });

    await application.save();

    // Populate user and job data
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
      resumeUrl: `${resumeFileName}`,
      createdAt: application.createdAt,
      status: application.status,
    };

    // Send confirmation email to applicant
    try {
      await sendEmail(
        application.userId.email,
        "Application Submitted Successfully",
        `Dear ${application.userId.name},\n\nYour application for the position "${application.jobId.title}" at ${application.jobId.company} has been submitted successfully.\n\nWe will review your application and get back to you soon.\n\nBest regards,\nRecruitFlow Team`,
      );
    } catch (emailError) {
      console.warn("Confirmation email failed:", emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: payload,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);

    // More specific error messages
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid job ID format",
      });
    }

    res.status(500).json({
      message: "Application failed. Please try again later.",
    });
  }
};

// ================= GET ALL APPLICATIONS (ADMIN) =================
export const getAllApplications = async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { status, jobId, fromDate, toDate } = req.query;

    let query = {};

    // Status filter
    if (status && status !== "all") {
      query.status = status.toLowerCase();
    }

    // Job filter
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      query.jobId = new mongoose.Types.ObjectId(jobId);
    }

    // Date range filter
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.createdAt.$lte = new Date(toDate);
      }
    }

    const applications = await Application.find(query)
      .populate({
        path: "userId",
        select: "name email phone",
        strictPopulate: false,
      })
      .populate({
        path: "jobId",
        select: "title company location",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    const result = applications.map((a) => ({
      _id: a._id,
      user: a.userId,
      job: a.jobId,
      resumeUrl: a.resume ? `${a.resume}` : null,
      createdAt: a.createdAt,
      status: a.status || "pending",
      updatedAt: a.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get All Applications Error:", error);
    res.status(500).json({
      message: "Error loading applications. Please try again.",
    });
  }
};

// ================= UPDATE STATUS (APPROVE / REJECT) =================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, notes } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    // Normalize status
    status = status.toLowerCase();

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be 'approved' or 'rejected'",
      });
    }

    const application = await Application.findById(id)
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

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Check if status is already the same
    if (application.status === status) {
      return res.status(400).json({
        message: `Application is already ${status}`,
      });
    }

    // Save old status for logging
    const oldStatus = application.status || "pending";

    // Update application
    application.status = status;
    if (notes) {
      application.notes = notes;
    }
    await application.save();

    // Send email notification
    try {
      if (status === "approved") {
        await sendEmail(
          application.userId.email,
          "Congratulations! Your Application Has Been Approved",
          `Dear ${application.userId.name},\n\nWe are pleased to inform you that your application for the position "${application.jobId.title}" at ${application.jobId.company} has been approved!\n\nCongratulations! You have been selected for the interview round.\n\nOur team will contact you shortly to schedule your interview.\n\nBest regards,\nRecruitFlow Team`,
        );
      } else if (status === "rejected") {
        await sendEmail(
          application.userId.email,
          "Update Regarding Your Application",
          `Dear ${application.userId.name},\n\nThank you for applying for the position "${application.jobId.title}" at ${application.jobId.company}.\n\nAfter careful consideration, we regret to inform you that we have decided not to move forward with your application at this time.\n\nWe appreciate your interest in our company and encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nRecruitFlow Team`,
        );
      }
    } catch (emailError) {
      console.warn("Status update email failed:", emailError.message);
      // Continue even if email fails
    }

    res.json({
      message: `Application ${status} successfully`,
      application: {
        _id: application._id,
        status: application.status,
        updatedAt: application.updatedAt,
      },
    });
  } catch (err) {
    console.error("Update Status Error:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    res.status(500).json({
      message: "Failed to update application status. Please try again.",
    });
  }
};

// ================= GET APPLICATION BY ID =================
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application = await Application.findById(id)
      .populate({
        path: "userId",
        select: "name email phone",
        strictPopulate: false,
      })
      .populate({
        path: "jobId",
        select: "title company location description",
        strictPopulate: false,
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const result = {
      _id: application._id,
      user: application.userId,
      job: application.jobId,
      resumeUrl: application.resume ? `${application.resume}` : null,
      createdAt: application.createdAt,
      status: application.status || "pending",
      updatedAt: application.updatedAt,
      notes: application.notes || null,
    };

    res.json(result);
  } catch (error) {
    console.error("Get Application By ID Error:", error);
    res.status(500).json({
      message: "Error loading application details",
    });
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
        select: "title company location salary",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 });

    const result = applications.map((a) => ({
      _id: a._id,
      job: a.jobId,
      resumeUrl: a.resume ? `${a.resume}` : null,
      status: a.status || "pending",
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get My Applications Error:", error);
    res.status(500).json({
      message: "Failed to load your applications. Please try again.",
    });
  }
};

// ================= GET APPLICATION STATISTICS =================
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to a more friendly format
    const formattedStats = {
      total: stats.reduce((sum, item) => sum + item.count, 0),
      pending: stats.find((item) => item._id === "pending")?.count || 0,
      approved: stats.find((item) => item._id === "approved")?.count || 0,
      rejected: stats.find((item) => item._id === "rejected")?.count || 0,
    };

    res.json(formattedStats);
  } catch (error) {
    console.error("Get Application Stats Error:", error);
    res.status(500).json({
      message: "Failed to load application statistics",
    });
  }
};
