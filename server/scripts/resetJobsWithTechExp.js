import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

dotenv.config();

const jobsData = [
  {
    title: "Backend Developer",
    company: "Amazon",
    location: "Hyderabad",
    salary: "10 LPA",
    description: "Node.js backend developer",
    technology: ["Node.js"],
    experience: "1 Year"
  },
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "12 LPA",
    description: "React frontend developer",
    technology: ["React"],
    experience: "1 Year"
  },
  {
    title: "Full Stack Developer",
    company: "Microsoft",
    location: "Pune",
    salary: "14 LPA",
    description: "Full stack web developer",
    technology: ["React", "Node.js"],
    experience: "2 Years"
  }
];

const run = async () => {
  await connectDB();
  await Job.deleteMany({});
  await Job.insertMany(jobsData);
  console.log("All jobs removed and new jobs added with Technology and Experience.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
