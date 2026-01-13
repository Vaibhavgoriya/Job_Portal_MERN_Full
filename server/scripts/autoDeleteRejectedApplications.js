// Script to auto-delete rejected applications older than 24 hours
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';

const applicationSchema = new mongoose.Schema({}, { strict: false });
const Application = mongoose.model('Application', applicationSchema, 'applications');

async function deleteOldRejectedApplications() {
  await mongoose.connect(MONGO_URI);
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const result = await Application.deleteMany({
    status: 'rejected',
    updatedAt: { $lte: cutoff }
  });
  console.log(`Deleted ${result.deletedCount} rejected applications older than 24 hours.`);
  await mongoose.disconnect();
}

deleteOldRejectedApplications().catch(err => {
  console.error('Error deleting old rejected applications:', err);
  process.exit(1);
});
