const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webgallery';
  
  console.log('🔍 Testing MongoDB connection...');
  console.log('Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide password
  
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ SUCCESS: MongoDB is connected!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED: Cannot connect to MongoDB');
    console.error('Error:', error.message);
    console.error('\n📋 Solutions:');
    console.error('1. If using local MongoDB: Make sure it\'s installed and running');
    console.error('   - Check: Get-Service MongoDB');
    console.error('   - Start: net start MongoDB');
    console.error('\n2. If using MongoDB Atlas:');
    console.error('   - Check your connection string in .env file');
    console.error('   - Make sure your IP is whitelisted in Atlas');
    console.error('   - Verify username and password are correct');
    process.exit(1);
  }
}

testConnection();

