import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

dotenv.config();

const DEFAULT_TECH = ["React", "Node.js"];
const DEFAULT_EXP = "1+ years";

const run = async () => {
  await connectDB();
  const jobs = await Job.find({});
  if (!jobs.length) {
    console.log("No jobs found");
    process.exit(0);
  }

  let updatedCount = 0;
  for (const job of jobs) {
    let update = {};
    if (!job.technology || !Array.isArray(job.technology) || job.technology.length === 0) {
      update.technology = DEFAULT_TECH;
    }
    if (!job.experience || job.experience === "") {
      update.experience = DEFAULT_EXP;
    }
    if (Object.keys(update).length > 0) {
      await Job.findByIdAndUpdate(job._id, update, { new: true, runValidators: true });
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} jobs with default Technology and Experience.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
