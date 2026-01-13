import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

// SEND OTP
export const adminSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOtp = otp;
    admin.resetOtpExpire = Date.now() + 5 * 60 * 1000;
    await admin.save();

    await sendEmail(
      email,
      "Admin Password Reset OTP",
      `Your OTP is ${otp}`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY OTP
export const adminVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });
    if (
      admin.resetOtp !== otp ||
      !admin.resetOtpExpire ||
      admin.resetOtpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
export const adminResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOtp = undefined;
    admin.resetOtpExpire = undefined;

    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
