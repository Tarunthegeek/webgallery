const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('Please define MONGODB_URI environment variable');
    }

    cached.promise = mongoose.connect(mongoURI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Image Schema
const imageSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  url: String, // Cloudinary URL
  publicId: String, // Cloudinary public ID for deletion
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

module.exports = { connectDB, Image };

