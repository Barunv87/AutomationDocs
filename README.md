# Online Tutorial Application

A full-stack web application for online learning with React frontend and Node.js/MongoDB backend.

## Features

### 🎯 Core Features
- **User Authentication**: Secure registration and login system
- **Tutorial Management**: Browse, search, and filter tutorials by category and difficulty
- **Interactive Learning**: Step-by-step lessons with progress tracking
- **Progress Dashboard**: Track your learning progress and completed tutorials
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📚 Tutorial Features
- **Structured Content**: Organized lessons with estimated time and difficulty levels
- **Progress Tracking**: Mark lessons as complete and track overall progress
- **Enrollment System**: Enroll in tutorials to access content
- **Categories**: Web Development, Programming, Database, and more
- **Search & Filter**: Find tutorials by title, description, category, or difficulty

### 👤 User Features
- **Personal Dashboard**: View enrolled tutorials and learning statistics
- **Progress Analytics**: Track completed lessons and tutorial completion rates
- **Recent Activity**: See your latest learning activities

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with modern design patterns
- **Responsive Design** with mobile-first approach

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd online-tutorial-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tutorial_app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod
```

### 5. Run the Application
```bash
# From the root directory - runs both frontend and backend
npm run dev

# Or run separately:
# Backend (from root directory)
npm run server

# Frontend (from root directory)  
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
online-tutorial-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main app component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # Express route handlers
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── package.json          # Root package.json with scripts
└── README.md            # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/:userId` - Get user profile

### Tutorials
- `GET /api/tutorials` - Get all tutorials (with optional filters)
- `GET /api/tutorials/:id` - Get single tutorial
- `POST /api/tutorials/:id/enroll` - Enroll in tutorial
- `POST /api/tutorials/:tutorialId/progress` - Update lesson progress

## Sample Data

The application comes with pre-seeded tutorial data including:
- **Introduction to React** - Beginner level web development tutorial
- **JavaScript ES6+ Features** - Intermediate programming concepts
- **MongoDB Fundamentals** - Database basics for beginners

## Usage Guide

### 1. Getting Started
1. Register a new account or login with existing credentials
2. Browse available tutorials on the home page or tutorials page
3. Use search and filters to find tutorials that match your interests

### 2. Learning Process
1. Click "Start Learning" on any tutorial to enroll
2. Progress through lessons at your own pace
3. Mark lessons as complete to track your progress
4. Use the navigation to move between lessons

### 3. Tracking Progress
1. Visit your dashboard to see enrolled tutorials
2. View completion statistics and recent activity
3. Continue learning from where you left off

## Development

### Adding New Features
1. **Frontend**: Add new components in `client/src/components/` or pages in `client/src/pages/`
2. **Backend**: Add new routes in `server/routes/` and models in `server/models/`
3. **Types**: Update TypeScript interfaces in `client/src/types/`

### Database Schema
- **Users**: Store user information, enrolled tutorials, and progress
- **Tutorials**: Store tutorial metadata, lessons, and content
- **Progress Tracking**: Embedded in user documents for efficient queries

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Happy Learning! 📚✨**