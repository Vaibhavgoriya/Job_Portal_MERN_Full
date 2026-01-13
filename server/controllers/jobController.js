import Job from "../models/Job.js";
import { getIO } from "../utils/socket.js";

/* GET ALL JOBS */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD JOB (ADMIN) */
export const addJob = async (req, res) => {
  try {
    const { title, company, location, salary, description, technology, experience } = req.body;

    // Always convert technology to array (split by comma if string)
    let techArr = [];
    if (Array.isArray(technology)) {
      techArr = technology;
    } else if (typeof technology === 'string') {
      techArr = technology.split(',').map(t => t.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      technology: techArr,
      experience: experience ? String(experience) : "",
    });

    // emit new job to users
    try {
      const io = getIO();
      console.log("Emitting newJob to users room", { jobId: job._id });
      io.to("users").emit("newJob", job);
      console.log("newJob emitted");
    } catch (err) {
      console.warn("Socket not available to emit newJob", err.message);
    }

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
