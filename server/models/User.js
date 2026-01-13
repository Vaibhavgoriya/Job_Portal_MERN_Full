import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ SAFE EXPORT
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
