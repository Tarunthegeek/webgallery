const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webgallery';
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    console.error('\n⚠️  IMPORTANT: MongoDB is not running or not accessible');
    console.error('Please do one of the following:');
    console.error('1. Start MongoDB: net start MongoDB (Windows) or mongod (Linux/Mac)');
    console.error('2. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('3. Use MongoDB Atlas (cloud): Update MONGODB_URI in .env file');
    console.error('\nServer will continue to run but database operations will fail until MongoDB is connected.\n');
  }
};

// Don't block server startup if MongoDB fails
connectDB().catch(console.error);

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB error:', err.message);
});

// Helper function to check connection
const checkDBConnection = () => {
  return mongoose.connection.readyState === 1;
};

// Image Schema
const imageSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model('Image', imageSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected. Please start MongoDB and restart the server.',
        details: 'MongoDB is not running. Start it with: net start MongoDB (Windows) or mongod (Linux/Mac)'
      });
    }

    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        error: 'Database connection lost. Please check MongoDB is running.',
        details: error.message
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    // Check MongoDB connection
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected. Please start MongoDB and restart the server.',
        details: 'MongoDB is not running. Start it with: net start MongoDB (Windows) or mongod (Linux/Mac)'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const image = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size
    });

    await image.save();
    res.json({ message: 'Image uploaded successfully', image });
  } catch (error) {
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        error: 'Database connection lost. Please check MongoDB is running.',
        details: error.message
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Download image
app.get('/api/download/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const filePath = path.join(__dirname, image.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, image.originalName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const filePath = path.join(__dirname, image.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api\n`);
  if (!checkDBConnection()) {
    console.log('⚠️  WARNING: MongoDB is not connected. Some features will not work.\n');
  }
});

