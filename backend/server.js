require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const {
  errorHandler,
  notFound,
} = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Connect Database (with error handling for Vercel)
let dbConnected = false;
connectDB().then(result => {
  dbConnected = result;
  console.log(`Database connection status: ${dbConnected ? 'Connected' : 'Failed - running without DB'}`);
}).catch(err => {
  console.error('Database connection error:', err.message);
  dbConnected = false;
});

const app = express();

/* =====================================
   SECURITY
===================================== */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* =====================================
   LOGGING
===================================== */

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

/* =====================================
   CORS CONFIGURATION - COMPLETE FIX
===================================== */

// Manual CORS middleware (must be first - handles all responses)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow all these origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://taskify-317y.vercel.app',
    'https://taskify-317y-git-main-aliyaaqueen2004-5723s-projects.vercel.app',
  ];

  // Check if origin is allowed (or if it's a vercel.app domain)
  if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours cache for preflight
  }

  // Handle preflight OPTIONS request immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// Backup CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    // Allow all Vercel deployments and localhost
    if (origin.includes('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin === 'https://taskify-317y.vercel.app' ||
      origin === 'https://taskify-317y-git-main-aliyaaqueen2004-5723s-projects.vercel.app') {
      return callback(null, true);
    }

    console.log('Blocked Origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
}));

/* =====================================
   RATE LIMITER
===================================== */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === "production"
      ? 200
      : 1000,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

/* =====================================
   BODY PARSERS
===================================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =====================================
   STATIC FILES
===================================== */

app.use("/uploads", express.static("uploads"));

/* =====================================
   HEALTH CHECK
===================================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    cors_enabled: true
  });
});

app.get("/db-test", (req, res) => {
  res.json({
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'Not connected',
    database: mongoose.connection.name || 'No database',
  });
});

/* =====================================
   ROOT ROUTE
===================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Task Management API Running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      auth_v1: "/api/v1/auth"
    }
  });
});

/* =====================================
   API ROUTES
===================================== */

// Primary routes with /api/v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);

// Alias routes with /api (for frontend compatibility)
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

/* =====================================
   TEST CORS ENDPOINT
===================================== */

app.get("/api/test-cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'No origin'
  });
});

/* =====================================
   ERROR HANDLING
===================================== */

app.use(notFound);
app.use(errorHandler);

/* =====================================
   LOCAL DEVELOPMENT ONLY
===================================== */

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 CORS enabled for Vercel deployments`);
  });
}

/* =====================================
   EXPORT FOR VERCEL
===================================== */

module.exports = app;