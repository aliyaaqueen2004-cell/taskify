const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Ensure the uploads directory exists
const fs = require('fs');
let uploadDir = path.join(__dirname, '..', 'uploads', 'tasks');

// Vercel serverless uses read-only filesystem except for /tmp
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  uploadDir = '/tmp/uploads/tasks';
}

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Warning: Could not create upload dir (Read-only filesystem?)', err);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, filename);
  },
});

// 5 MB limit, only allow common types for now
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
