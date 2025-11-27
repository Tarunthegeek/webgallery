# Web Gallery - Full Stack Application

A beautiful web gallery application that allows users to upload, view, and download images. Built with React, Node.js, Express, MongoDB, and TailwindCSS.

> **⚠️ Having MongoDB connection issues?**  
> **👉 See [START_HERE.md](./START_HERE.md) for the quickest fix!**

## Features

- 📸 Upload images (JPEG, PNG, GIF, WebP)
- 👀 View all uploaded images in a responsive grid
- ⬇️ Download images
- 🗑️ Delete images
- 🎨 Modern UI with TailwindCSS

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Axios
- **Backend**: Node.js, Express, Multer
- **Database**: MongoDB, Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

> **⚠️ IMPORTANT: MongoDB Setup Required!**  
> If you're getting connection errors, see **[SETUP_MONGODB.md](./SETUP_MONGODB.md)** for detailed setup instructions.

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/webgallery
```

For MongoDB Atlas, use:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

## Running the Application

### Start MongoDB

**MongoDB is required for this application to work!**

If you haven't set up MongoDB yet, see **[SETUP_MONGODB.md](./SETUP_MONGODB.md)** for complete instructions.

**Quick options:**
- **Easiest**: Use MongoDB Atlas (cloud) - no installation needed
- **Local**: Install MongoDB Community Server

If MongoDB is installed locally:
```bash
# Windows
net start MongoDB

# Linux/Mac
mongod
```

### Start Backend Server

```bash
cd backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
web-gallery/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json
│   ├── uploads/           # Uploaded images (created automatically)
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageGallery.jsx
│   │   │   └── UploadForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

- `GET /api/images` - Get all images
- `POST /api/upload` - Upload an image
- `GET /api/download/:id` - Download an image by ID
- `DELETE /api/images/:id` - Delete an image by ID

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Select Image" to choose an image file
3. Click "Upload Image" to upload
4. View all uploaded images in the gallery
5. Click "Download" to download an image
6. Click "Delete" to remove an image

## Notes

- Maximum file size: 10MB
- Supported formats: JPEG, JPG, PNG, GIF, WebP
- Images are stored in the `backend/uploads` directory
- Image metadata is stored in MongoDB

