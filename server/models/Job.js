import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    // jobType removed (already handled)
    salary: String,
    description: String,
    technology: [String],
    technologyName: String,
    experience: String,
    experienceValue: String,
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
