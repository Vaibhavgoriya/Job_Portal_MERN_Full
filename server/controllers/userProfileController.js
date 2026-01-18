import User from "../models/User.js";

// GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/upload-profile-pic
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `/uploads/profilePics/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { profilePic: url });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/upload-resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `/uploads/resumes/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { resume: url });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
