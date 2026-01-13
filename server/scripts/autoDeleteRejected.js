import cron from "node-cron";
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
  if (result.deletedCount > 0) {
    console.log(`Deleted ${result.deletedCount} rejected applications older than 24 hours.`);
  }
}

// Schedule to run every hour
cron.schedule("0 * * * *", async () => {
  await removeOldRejectedApplications();
});

console.log("Auto-delete job for rejected applications scheduled (every hour)");
