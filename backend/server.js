require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require('socket.io');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Database Connection
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Configuration for Vercel (WebSockets have limitations on Vercel)
// For production with WebSockets, consider using Pusher or Socket.io with custom server
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://taskify-317y.vercel.app',
      'https://taskify-317y-git-main-aliyaaqueen2004-5723s-projects.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  // Important for Vercel serverless
  path: '/socket.io/',
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Setup Socket.io
io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('join-workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
  });

  socket.on('leave-workspace', (workspaceId) => {
    socket.leave(workspaceId);
  });

  socket.on('task-updated', (data) => {
    socket.to(data.workspaceId).emit('task-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin for Vercel
}));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS Configuration - Updated for Vercel deployment
app.use((req, res, next) => {
  // Allow your specific frontend domain
  const allowedOrigins = [
    'https://taskify-317y.vercel.app',
    'https://taskify-317y-git-main-aliyaaqueen2004-5723s-projects.vercel.app',
    'https://taskify-frontend.vercel.app'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || origin?.includes('vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // Change this part
    if (process.env.NODE_ENV === 'production') {
      // Allow ANY vercel.app domain temporarily
      if (!origin || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Rate Limiter - Adjusted for Vercel serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 1000, // Higher limit for production
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  keyGenerator: (req) => {
    // Use IP from Vercel's headers if behind proxy
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }
});

// Apply rate limiter to all API endpoints
app.use('/api', limiter);

// Request Parsing Middlewares
app.use(express.json({ limit: '10mb' })); // Increased limit for larger payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve uploaded files (for Vercel, consider using cloud storage like AWS S3)
app.use('/uploads', express.static('uploads'));

// Health Check Endpoint (useful for Vercel monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Task Management API is running...',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      tasks: '/api/v1/tasks',
      ai: '/api/v1/ai',
      analytics: '/api/v1/analytics',
      admin: '/api/v1/admin'
    }
  });
});

// API Routes - Note: Your routes use /api/v1, not /api
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);

// Add these alias routes for frontend compatibility
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Your existing routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
// ... other v1 routes

// ADD THESE ALIAS ROUTES FOR YOUR FRONTEND
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes);     // Frontend calls /api/auth
app.use('/api/tasks', taskRoutes);    // Frontend calls /api/tasks
// Add other routes as needed

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`CORS allowed origins:`, allowedOrigins);
  });
}

// Export for Vercel - IMPORTANT
module.exports = app;