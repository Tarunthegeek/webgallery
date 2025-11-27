# MongoDB Setup Guide

## ❌ Current Status: MongoDB is NOT installed

You have two options:

---

## ✅ Option 1: MongoDB Atlas (Cloud - EASIEST - Recommended)

**Best for beginners - No installation needed!**

1. **Sign up for free**: https://www.mongodb.com/cloud/atlas/register
2. **Create a free cluster** (takes 3-5 minutes)
3. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. **Update your `.env` file** in the `backend` folder:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/webgallery?retryWrites=true&w=majority
   ```
   Replace `your-username` and `your-password` with your Atlas credentials.

5. **Restart your backend server**

**That's it!** No installation needed.

---

## ✅ Option 2: Install MongoDB Locally

### Windows Installation:

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Click Download

2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (optional GUI tool)
   - Click Install

3. **Start MongoDB**:
   ```powershell
   net start MongoDB
   ```

4. **Verify it's running**:
   ```powershell
   Get-Service MongoDB
   ```
   Should show "Running"

5. **Your `.env` file should already be correct**:
   ```
   MONGODB_URI=mongodb://localhost:27017/webgallery
   ```

6. **Restart your backend server**

---

## 🧪 Test Your Connection

After setting up MongoDB (either option), restart your backend:

```powershell
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

If you see connection errors, check:
- MongoDB Atlas: Is your IP address whitelisted? (Atlas → Network Access → Add IP Address)
- Local MongoDB: Is the service running? (`Get-Service MongoDB`)

---

## 🆘 Still Having Issues?

1. **Check the backend console** - it will show specific error messages
2. **Verify your `.env` file** is in the `backend` folder
3. **Make sure MongoDB is running** before starting the backend server

