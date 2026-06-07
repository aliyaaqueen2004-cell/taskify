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

// Connect Database
connectDB();

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
   CORS CONFIGURATION
===================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://taskify-317y.vercel.app",
  "https://taskify-317y-git-main-aliyaaqueen2004-5723s-projects.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

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
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});
app.get("/db-test", (req, res) => {
  res.json({
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    database: mongoose.connection.name,
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
  });
});

/* =====================================
   API ROUTES
===================================== */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);

/* =====================================
   OPTIONAL ALIASES
===================================== */

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

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
    console.log(`Server running on port ${PORT}`);
    console.log("Allowed Origins:", allowedOrigins);
  });
}

/* =====================================
   EXPORT FOR VERCEL
===================================== */

module.exports = app;