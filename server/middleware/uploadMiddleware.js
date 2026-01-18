import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check file type for folder
    if (file.fieldname === "profilePic") {
      cb(null, "uploads/profilePics");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    } else {
      cb(null, "uploads/others");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload; // 👈 MUST
