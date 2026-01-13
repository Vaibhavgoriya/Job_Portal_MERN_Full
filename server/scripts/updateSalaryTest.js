import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

dotenv.config();

const run = async () => {
  await connectDB();
  const job = await Job.findOne().sort({ createdAt: -1 }).lean();
  if (!job) {
    console.log("No job found");
    process.exit(0);
  }

  console.log("Before update:", job);

  const newSalary = "₹99,999";
  const updated = await Job.findByIdAndUpdate(job._id, { salary: newSalary }, { new: true, runValidators: true });

  console.log("After update:", updated);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});