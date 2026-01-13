import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import Admin from "./models/Admin.js";

dotenv.config();
connectDB();

const app = express();

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ AUTH ROUTES (FIXED)
app.use("/api/users", userAuthRoutes);
app.use("/api/admin", adminAuthRoutes);

// Other routes (unchanged)
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Create server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("✅ Socket connected:", socket.id);

  const token = socket.handshake.auth?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select("-password");

      if (admin) {
        socket.join("admins");
        socket.admin = admin;
        console.log("Admin joined admins room");
      } else {
        socket.join("users");
      }
    } catch (err) {
      socket.join("users");
    }
  } else {
    socket.join("users");
  }

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

