# 🚀 Step-by-Step Local Setup Guide

## Prerequisites (Install First)

1. **Install Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Choose LTS version
   - Verify: Open terminal/command prompt → type `node --version`

2. **Install Git** (optional but recommended)
   - Download from: https://git-scm.com/

3. **Code Editor** (recommended)
   - VS Code: https://code.visualstudio.com/

## Method 1: Automated Setup (Easiest)

### Step 1: Download Setup Script
1. Create a new file called `create-local-app.sh` (Mac/Linux) or `create-local-app.bat` (Windows)
2. Copy the setup script content (I'll provide separately)

### Step 2: Run Setup Script
```bash
# Mac/Linux
chmod +x create-local-app.sh
./create-local-app.sh

# Windows (create .bat file instead)
create-local-app.bat
```

## Method 2: Manual Setup

### Step 1: Create Project Directory
```bash
mkdir online-tutorial-app
cd online-tutorial-app
```

### Step 2: Initialize Root Project
```bash
npm init -y
```

Edit `package.json`:
```json
{
  "name": "online-tutorial-app",
  "version": "1.0.0",
  "description": "Online Tutorial Application",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

Install dependencies:
```bash
npm install
```

### Step 3: Create React Frontend
```bash
npx create-react-app client --template typescript
cd client
npm install react-router-dom axios @types/node
cd ..
```

### Step 4: Create Backend Server
```bash
mkdir server
cd server
npm init -y
```

Install backend dependencies:
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

### Step 5: Add Source Code Files
You'll need to create these files with the provided source code:

**Backend Files:**
- `server/index.js` - Main server file
- `server/models/Tutorial.js` - Tutorial model
- `server/models/User.js` - User model  
- `server/routes/tutorials.js` - Tutorial routes
- `server/routes/auth.js` - Authentication routes
- `server/.env` - Environment variables

**Frontend Files:**
- `client/src/App.tsx` - Main app component
- `client/src/types/index.ts` - TypeScript interfaces
- `client/src/services/api.ts` - API service
- `client/src/context/AuthContext.tsx` - Authentication context
- `client/src/components/Header.tsx` - Header component
- `client/src/pages/Home.tsx` - Home page
- `client/src/pages/Login.tsx` - Login page
- `client/src/pages/Register.tsx` - Register page
- `client/src/pages/TutorialList.tsx` - Tutorial list page
- `client/src/pages/TutorialViewer.tsx` - Tutorial viewer
- `client/src/pages/Dashboard.tsx` - User dashboard
- Plus corresponding CSS files

## Step 6: Start the Application

1. **Install all dependencies:**
```bash
npm run install-all
```

2. **Start both servers:**
```bash
npm run dev
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

### Common Issues:

1. **Port already in use:**
   - Change ports in `.env` files
   - Kill existing processes: `pkill node`

2. **Dependencies not found:**
   - Run `npm run install-all`
   - Delete `node_modules` and reinstall

3. **MongoDB connection:**
   - App works with mock data if MongoDB not available
   - Install MongoDB locally or use MongoDB Atlas

4. **CORS errors:**
   - Ensure backend CORS is configured
   - Check API URLs in frontend

### Windows Users:
- Use Git Bash or PowerShell for terminal commands
- Replace `./` with `.\` for script execution

## What You'll Get

✅ **Complete Tutorial Application:**
- Beautiful React frontend with TypeScript
- Express.js backend with MongoDB
- User authentication and registration
- Tutorial catalog with search/filter
- Interactive lesson viewer
- Progress tracking dashboard
- Responsive design for mobile/desktop

✅ **Sample Content:**
- 3 complete tutorials with multiple lessons
- React, JavaScript, and MongoDB tutorials
- Progress tracking and user enrollment

## Need Help?

1. Check the console for error messages
2. Verify Node.js and npm versions
3. Ensure all dependencies are installed
4. Check if ports 3000 and 5000 are available

The application will work perfectly with mock data even without MongoDB installed!