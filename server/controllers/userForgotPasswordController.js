import User from "../models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

// SEND OTP
export const userSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📥 Forgot password request for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ User found:", user.email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔑 OTP generated:", otp);

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();
    console.log("💾 OTP saved to database");

    console.log("📧 Calling sendEmail function...");
    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    console.log("✅ Email sent successfully");
    res.status(400).json({ message: "✅ Email sent successfully" });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error in userSendOtp:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({
      message: "Failed to send OTP. Please try again.",
      error: err.message,
    });
  }
};

// ================= VERIFY OTP =================
export const userVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("🔍 Verifying OTP for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.resetOtp !== otp ||
      !user.resetOtpExpire ||
      user.resetOtpExpire < Date.now()
    ) {
      console.log("❌ Invalid or expired OTP for:", email);
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    console.log("✅ OTP verified successfully for:", email);
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("❌ Error in userVerifyOtp:", err);
    res.status(500).json({
      message: "OTP verification failed",
      error: err.message,
    });
  }
};

// RESET PASSWORD
export const userResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log("🔑 Resetting password for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();
    console.log("✅ Password reset successful for:", email);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error in userResetPassword:", err);
    res.status(500).json({
      message: "Password reset failed",
      error: err.message,
    });
  }
};
