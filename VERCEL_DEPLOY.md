# Deploying to Vercel

This guide will help you deploy your web gallery to Vercel.

## Prerequisites

1. **Cloudinary Account** (for image storage)
   - Sign up at https://cloudinary.com (free tier available)
   - Get your Cloud Name, API Key, and API Secret from the dashboard

2. **MongoDB Atlas** (already set up)
   - Your MongoDB connection string

3. **Vercel Account**
   - Sign up at https://vercel.com (free tier available)

## Step 1: Set Up Cloudinary

1. Go to https://cloudinary.com and create a free account
2. In the dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional, or use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com/new
   - Import your GitHub repository: `Tarunthegeek/webgallery`
   - Vercel will auto-detect the project structure

3. **Configure Environment Variables**:
   In Vercel dashboard → Project Settings → Environment Variables, add:
   
   ```
   MONGODB_URI = your_mongodb_atlas_connection_string
   CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET = your_cloudinary_api_secret
   ```

4. **Configure Build Settings**:
   - **Root Directory**: Leave as root (`.`)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm run install-all` (or manually install both)

   OR use these settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

## Step 3: Update Frontend API URL (if needed)

The frontend is configured to use `/api` as the base URL, which will automatically work with Vercel's API routes. No changes needed!

## Step 4: Test Your Deployment

1. Visit your Vercel deployment URL (e.g., `https://webgallery.vercel.app`)
2. Try uploading an image
3. Verify images appear in the gallery
4. Test download and delete functionality

## Troubleshooting

### API Routes Not Working
- Check that your `api/` folder is in the root directory
- Verify environment variables are set correctly
- Check Vercel function logs in the dashboard

### Images Not Uploading
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for uploaded images
- Review Vercel function logs for errors

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Vercel's IPs (or use 0.0.0.0/0 for testing)
- Check MongoDB connection string is correct
- Review function logs for connection errors

## Project Structure for Vercel

```
web-gallery/
├── api/              # Vercel serverless functions
│   ├── db.js
│   ├── images.js
│   ├── upload.js
│   ├── download/
│   │   └── [id].js
│   └── images/
│       └── [id].js
├── frontend/         # React frontend
│   ├── src/
│   ├── dist/         # Build output
│   └── package.json
├── backend/          # Original Express server (not used in Vercel)
├── vercel.json       # Vercel configuration
└── package.json
```

## Notes

- The `backend/` folder is kept for local development
- For local dev, run `cd backend && npm start` for the API
- For production, Vercel uses the `api/` folder for serverless functions
- Images are stored in Cloudinary, not on the filesystem

