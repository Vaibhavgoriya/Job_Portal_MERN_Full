import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "../models/Application.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

async function removeOldRejectedApplications() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const result = await Application.deleteMany({
    status: "rejected",
    updatedAt: { $lt: cutoff },
  });
  console.log(`Deleted ${result.deletedCount} rejected applications older than 24 hours.`);
  mongoose.connection.close();
}

removeOldRejectedApplications();
