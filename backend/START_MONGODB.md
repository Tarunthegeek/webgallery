# How to Start MongoDB

## Check if MongoDB is Installed

Run this command in PowerShell:
```powershell
mongod --version
```

If you get an error, MongoDB is not installed.

## Option 1: Start MongoDB Service (Windows)

If MongoDB is installed as a Windows service:

```powershell
# Start MongoDB service
net start MongoDB

# Check if it's running
Get-Service MongoDB
```

## Option 2: Run MongoDB Manually

If MongoDB is installed but not as a service:

```powershell
# Navigate to MongoDB bin directory (usually)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB
.\mongod.exe
```

## Option 3: Install MongoDB

1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install it with default settings
3. MongoDB will be installed as a Windows service and should start automatically

## Option 4: Use MongoDB Atlas (Cloud - Recommended for Beginners)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update your `.env` file:
   ```
   MONGODB_URI=your_atlas_connection_string_here
   ```

## Verify MongoDB is Running

After starting MongoDB, you should see:
- No errors in the terminal
- The server should connect successfully (check backend console)

Test the connection:
```powershell
mongosh
```

If it connects, MongoDB is running!

