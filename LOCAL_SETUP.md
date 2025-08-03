# 🚀 Local Setup Guide - Online Tutorial Application

## Prerequisites
- Node.js (v14+): https://nodejs.org/
- Git: https://git-scm.com/
- Code editor (VS Code recommended)

## Step 1: Create Project Directory
```bash
mkdir online-tutorial-app
cd online-tutorial-app
```

## Step 2: Initialize Project Structure
```bash
# Create main directories
mkdir server client

# Initialize package.json files
npm init -y
```

## Step 3: Set up Backend (Server)
```bash
cd server

# Create package.json
cat > package.json << 'EOF'
{
  "name": "tutorial-server",
  "version": "1.0.0",
  "description": "Backend server for online tutorial application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

# Install backend dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tutorial_app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
EOF

cd ..
```

## Step 4: Set up Frontend (React)
```bash
# Create React app
npx create-react-app client --template typescript

cd client

# Install additional dependencies
npm install react-router-dom axios @types/node

# Create .env file for React
cat > .env << 'EOF'
HOST=0.0.0.0
PORT=3000
BROWSER=none
EOF

cd ..
```

## Step 5: Update Root Package.json
```bash
cat > package.json << 'EOF'
{
  "name": "online-tutorial-app",
  "version": "1.0.0",
  "description": "Online Tutorial Application with React and MongoDB",
  "main": "server/index.js",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install",
    "build": "cd client && npm run build"
  },
  "keywords": ["tutorial", "react", "mongodb", "education"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
EOF

# Install concurrently for running both servers
npm install
```

## Step 6: Quick Start Commands

After setting up the structure, you'll need the application files. Run these commands:

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

## Step 7: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting
1. **Port conflicts**: Change ports in .env files if needed
2. **MongoDB issues**: App works with mock data if MongoDB isn't available
3. **Dependencies**: Run `npm run install-all` if you get module errors

## Application Features
✨ Browse tutorials and lessons
👤 User registration and authentication  
📚 Tutorial enrollment and progress tracking
📊 Personal learning dashboard
🔍 Search and filter tutorials
📱 Responsive design for mobile/desktop