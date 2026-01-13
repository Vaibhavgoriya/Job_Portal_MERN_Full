import User from "../models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

// SEND OTP
export const userSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ================= VERIFY OTP =================
export const userVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });
    if (
      user.resetOtp !== otp ||
      !user.resetOtpExpire ||
      user.resetOtpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
export const userResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
