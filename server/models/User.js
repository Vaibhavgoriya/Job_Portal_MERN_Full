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
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    skills: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ SAFE EXPORT
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
