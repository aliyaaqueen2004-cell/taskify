const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import your routes
const authRoutes = require('../routes/authRoutes');
const taskRoutes = require('../routes/taskRoutes');

const app = express();

// CORS configuration - CRITICAL for your frontend
app.use(cors({
  origin: 'https://taskify-317y.vercel.app', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Your API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Export for Vercel serverless
module.exports = app;
