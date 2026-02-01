import Job from "../models/Job.js";

/* GET ALL JOBS (Public) */
export const getAllJobs = async (req, res) => {
  try {
    // Optional query parameters for filtering
    const {
      search,
      location,
      company,
      technology,
      sortBy = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query object
    let query = {};

    // Search filter (title, company, or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Company filter
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    // Technology filter
    if (technology) {
      const techArray = technology
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      query.technology = { $in: techArray };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case "newest":
        sort.createdAt = -1;
        break;
      case "oldest":
        sort.createdAt = 1;
        break;
      case "title-asc":
        sort.title = 1;
        break;
      case "title-desc":
        sort.title = -1;
        break;
      case "company-asc":
        sort.company = 1;
        break;
      case "company-desc":
        sort.company = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Execute query with pagination
    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(limitNum),
      Job.countDocuments(query),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      jobs,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        hasNextPage,
        hasPrevPage,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    res.status(500).json({
      message: "Failed to load jobs. Please try again later.",
    });
  }
};

/* GET JOB BY ID (Public) */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Get similar jobs (same company or similar technology)
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      $or: [
        { company: job.company },
        { technology: { $in: job.technology || [] } },
      ],
    }).limit(3);

    res.json({
      job,
      similarJobs,
    });
  } catch (error) {
    console.error("Get Job By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid job ID format",
      });
    }

    res.status(500).json({
      message: "Failed to load job details. Please try again.",
    });
  }
};

/* ADD JOB (Admin) */
export const addJob = async (req, res) => {
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

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Job title is required",
      });
    }

    if (!company || !company.trim()) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({
        message: "Location is required",
      });
    }

    // Always convert technology to array (split by comma if string)
    let techArr = [];
    if (Array.isArray(technology)) {
      techArr = technology;
    } else if (typeof technology === "string") {
      techArr = technology
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salary ? salary.trim() : "",
      description: description ? description.trim() : "",
      technology: techArr,
      experience: experience ? String(experience).trim() : "",
    });

    res.status(201).json({
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error("Add Job Error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      message: "Failed to create job. Please try again.",
    });
  }
};

/* UPDATE JOB (Admin) */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      location,
      salary,
      description,
      technology,
      experience,
    } = req.body;

    // Find job first
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Always convert technology to array (split by comma if string)
    let techArr = [];
    if (Array.isArray(technology)) {
      techArr = technology;
    } else if (typeof technology === "string") {
      techArr = technology
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (technology === undefined) {
      // Keep existing technology if not provided
      techArr = job.technology || [];
    }

    // Update job fields
    job.title = title !== undefined ? title.trim() : job.title;
    job.company = company !== undefined ? company.trim() : job.company;
    job.location = location !== undefined ? location.trim() : job.location;
    job.salary = salary !== undefined ? salary.trim() : job.salary;
    job.description =
      description !== undefined ? description.trim() : job.description;
    job.technology = techArr;
    job.experience =
      experience !== undefined ? String(experience).trim() : job.experience;
    job.updatedAt = Date.now();

    await job.save();

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid job ID format",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      message: "Failed to update job. Please try again.",
    });
  }
};

/* DELETE JOB (Admin) */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(id);

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid job ID format",
      });
    }

    res.status(500).json({
      message: "Failed to delete job. Please try again.",
    });
  }
};

/* GET JOB STATISTICS (Admin) */
export const getJobStats = async (req, res) => {
  try {
    // Get total job count
    const totalJobs = await Job.countDocuments();

    // Get jobs by company
    const jobsByCompany = await Job.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get technology distribution
    const techDistribution = await Job.aggregate([
      { $unwind: "$technology" },
      {
        $group: {
          _id: "$technology",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    // Get location distribution
    const locationDistribution = await Job.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalJobs,
      jobsByCompany,
      techDistribution,
      locationDistribution,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Get Job Stats Error:", error);
    res.status(500).json({
      message: "Failed to load job statistics",
    });
  }
};

/* SEARCH JOBS (Public) */
export const searchJobs = async (req, res) => {
  try {
    const { q, location, tech, company } = req.query;

    let query = {};

    // Text search across multiple fields
    if (q) {
      query.$text = { $search: q };
    }

    // Additional filters
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (tech) {
      const techArray = tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      query.technology = { $in: techArray };
    }

    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    const jobs = await Job.find(query)
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(20);

    res.json(jobs);
  } catch (error) {
    console.error("Search Jobs Error:", error);
    res.status(500).json({
      message: "Failed to search jobs. Please try again.",
    });
  }
};
