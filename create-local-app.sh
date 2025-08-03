#!/bin/bash

echo "🚀 Creating Online Tutorial Application Locally"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Create project directory
PROJECT_NAME="online-tutorial-app"
echo "📁 Creating project directory: $PROJECT_NAME"

if [ -d "$PROJECT_NAME" ]; then
    echo "⚠️  Directory $PROJECT_NAME already exists. Remove it? (y/N)"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_NAME"
    else
        echo "❌ Exiting..."
        exit 1
    fi
fi

mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "📦 Setting up project structure..."

# Create root package.json
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

echo "🔧 Installing root dependencies..."
npm install

echo "🌐 Creating React frontend..."
npx create-react-app client --template typescript

cd client
echo "📱 Installing additional frontend dependencies..."
npm install react-router-dom axios @types/node

# Create client .env
cat > .env << 'EOF'
HOST=0.0.0.0
PORT=3000
BROWSER=none
EOF

cd ..

echo "🖥️  Setting up backend server..."
mkdir -p server/models server/routes

# Create server package.json
cat > server/package.json << 'EOF'
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

cd server
echo "⚙️  Installing backend dependencies..."
npm install

# Create server .env
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tutorial_app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
EOF

cd ..

echo ""
echo "✅ Project structure created successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Navigate to the project: cd $PROJECT_NAME"
echo "2. Copy the source code files (I'll provide them next)"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "🎯 The application will work with mock data even without MongoDB!"
echo "=============================================="