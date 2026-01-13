import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

dotenv.config();

const IT_TECHNOLOGIES = [
  "React", "Node.js", "Angular", "Vue.js", "Java", "Python", "PHP", "C#", "C++", "Android", "iOS", "Flutter", ".NET", "DevOps", "UI/UX", "QA", "Data Science", "AI/ML", "Other"
];
const EXPERIENCE_LEVELS = [
  "Fresher", "0-1 years", "1-2 years", "2-4 years", "4-6 years", "6+ years"
];

const run = async () => {
  await connectDB();
  const jobs = await Job.find();
  for (const job of jobs) {
    // Only update if missing or empty
    const update = {};
    if (!job.technology || !Array.isArray(job.technology) || job.technology.length === 0) {
      update.technology = [IT_TECHNOLOGIES[Math.floor(Math.random() * IT_TECHNOLOGIES.length)]];
    }
    if (!job.experience) {
      update.experience = EXPERIENCE_LEVELS[Math.floor(Math.random() * EXPERIENCE_LEVELS.length)];
    }
    if (Object.keys(update).length > 0) {
      await Job.findByIdAndUpdate(job._id, update, { new: true, runValidators: true });
      console.log(`Updated job ${job._id} with`, update);
    }
  }
  console.log("All jobs updated with IT Technology and Experience values.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
