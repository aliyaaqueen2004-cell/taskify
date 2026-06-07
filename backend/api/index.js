// This is the ONLY entry point for Vercel - Simplified version
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

// ========== CORS MUST BE FIRST ==========
app.use(cors({
  origin: 'https://taskify-317y.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Handle preflight
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// ========== HEALTH CHECKS ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    }
  });
});

// ========== SIMPLE AUTH ROUTES (NO DATABASE) ==========
// These will work immediately - replace with real DB later

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  
  const token = jwt.sign(
    { id: Date.now().toString(), email },
    process.env.JWT_SECRET || 'temp_secret',
    { expiresIn: '7d' }
  );
  
  res.status(201).json({
    success: true,
    token,
    user: { id: Date.now().toString(), email, name: name || email.split('@')[0] }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  
  const token = jwt.sign(
    { id: '123', email },
    process.env.JWT_SECRET || 'temp_secret',
    { expiresIn: '7d' }
  );
  
  res.json({
    success: true,
    token,
    user: { id: '123', email, name: email.split('@')[0] }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'temp_secret');
    res.json({
      success: true,
      user: { id: decoded.id, email: decoded.email }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

// ========== 404 Handler - NO WILDCARD ==========
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: `Route ${req.method} ${req.url} not found` 
  });
});

// ========== Error Handler ==========
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

module.exports = app;
