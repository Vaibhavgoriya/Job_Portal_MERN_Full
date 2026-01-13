import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

dotenv.config();

const run = async () => {
  await connectDB();
  const jobs = await Job.find({ Technology: { $exists: true } });
  let updated = 0;
  for (const job of jobs) {
    if ((!job.technology || job.technology.length === 0) && job.Technology) {
      const techArr = Array.isArray(job.Technology)
        ? job.Technology
        : [job.Technology];
      await Job.findByIdAndUpdate(job._id, {
        $set: { technology: techArr },
        $unset: { Technology: 1 },
      });
      console.log(`Updated job: ${job.title} (${job._id}) | technology: ${techArr}`);
      updated++;
    } else if (job.Technology) {
      await Job.findByIdAndUpdate(job._id, {
        $unset: { Technology: 1 },
      });
      console.log(`Removed legacy Technology field from: ${job.title} (${job._id})`);
    }
  }
  console.log(`Total updated: ${updated}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
