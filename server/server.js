import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    
    const app = express();

    // ES module fix
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // ✅ CORS configuration - UPDATED with your new backend URL
    const allowedOrigins = [
      'http://localhost:3000',
      'https://job-portal-mern-full.vercel.app',
      'https://job-portal-mern-full-oj3d7gbnf-vaibhav-goriyas-projects.vercel.app',
      'https://job-portal-backend-nfbt.onrender.com'  // ✅ Added your new backend URL
    ];

    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log('❌ Blocked origin:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Body parsers
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Static uploads
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Request logging
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // Routes
    app.use("/api/users", userAuthRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/admin", adminAuthRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/applications", applicationRoutes);

    // Health check
    app.get("/", (req, res) => {
      res.json({ 
        status: "success", 
        message: "🚀 API is running successfully",
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ 
        status: "error", 
        message: `Route ${req.path} not found` 
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('❌ Server Error:', err);
      
      if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ 
          status: "error", 
          message: "CORS error: Domain not allowed" 
        });
      }

      res.status(500).json({ 
        status: "error", 
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/db.js";
// import userAuthRoutes from "./routes/userAuthRoutes.js";
// import adminAuthRoutes from "./routes/adminAuthRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";
// import applicationRoutes from "./routes/applicationRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();

// // ES module fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Auth & User Routes
// app.use("/api/users", userAuthRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminAuthRoutes);

// // Other Routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/applications", applicationRoutes);

// // Health check (optional but recommended)
// app.get("/", (req, res) => {
//   res.send("🚀 API is running successfully");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
