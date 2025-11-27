const { connectDB, Image } = require('./db');
const cloudinary = require('cloudinary').v2;
const Busboy = require('busboy');
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Parse multipart form data using busboy
    return new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: req.headers });
      let fileBuffer = null;
      let fileName = null;
      let fileMimeType = null;
      let fileSize = 0;

      busboy.on('file', (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        fileName = filename;
        fileMimeType = mimeType;
        
        const chunks = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
          fileSize += chunk.length;
        });

        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on('finish', async () => {
        try {
          if (!fileBuffer || !fileName) {
            res.status(400).json({ error: 'No file uploaded' });
            resolve();
            return;
          }

          // Validate file type
          const allowedTypes = /jpeg|jpg|png|gif|webp/;
          const extname = allowedTypes.test(fileName.toLowerCase());
          const mimetype = allowedTypes.test(fileMimeType);

          if (!mimetype || !extname) {
            res.status(400).json({ error: 'Only image files are allowed!' });
            resolve();
            return;
          }

          // Validate file size (10MB limit)
          if (fileSize > 10 * 1024 * 1024) {
            res.status(400).json({ error: 'File size exceeds 10MB limit' });
            resolve();
            return;
          }

          // Upload to Cloudinary using buffer
          const uploadResult = await new Promise((resolveUpload, rejectUpload) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'webgallery',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) rejectUpload(error);
                else resolveUpload(result);
              }
            );

            // Create a readable stream from buffer
            const bufferStream = new Readable();
            bufferStream.push(fileBuffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
          });

          // Save to database
          const image = new Image({
            filename: uploadResult.public_id,
            originalName: fileName,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            size: fileSize,
          });

          await image.save();

          res.status(200).json({ message: 'Image uploaded successfully', image });
          resolve();
        } catch (error) {
          console.error('Upload error:', error);
          res.status(500).json({ error: error.message });
          resolve();
        }
      });

      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        res.status(500).json({ error: 'Error parsing form data' });
        resolve();
      });

      // Pipe request to busboy
      req.pipe(busboy);
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

