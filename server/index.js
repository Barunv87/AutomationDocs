const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tutorialRoutes = require('./routes/tutorials');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Global variable to track if we're using mock data
global.usingMockData = false;

// Connect to MongoDB with fallback
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB');
    seedDatabase();
  } catch (error) {
    console.warn('MongoDB connection failed, using mock data:', error.message);
    global.usingMockData = true;
    setupMockData();
  }
}

connectToDatabase();

// Routes
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  const status = global.usingMockData ? 'Mock Data Mode' : 'Database Connected';
  res.json({ 
    message: 'Tutorial App API is running!',
    status: status,
    timestamp: new Date().toISOString()
  });
});

// Setup mock data when MongoDB is not available
function setupMockData() {
  // We'll store mock data in memory
  global.mockTutorials = [
    {
      _id: '1',
      title: "Introduction to React",
      description: "Learn the fundamentals of React.js, including components, state, and props.",
      category: "Web Development",
      difficulty: "Beginner",
      author: "Tutorial Expert",
      tags: ["React", "JavaScript", "Frontend"],
      estimatedTime: 180,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        {
          title: "What is React?",
          content: "React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Facebook and the open-source community. React allows you to create reusable UI components and manage application state efficiently.",
          order: 1,
          duration: 15
        },
        {
          title: "Setting Up Your Development Environment",
          content: "Before we start coding, let's set up our development environment. You'll need Node.js installed on your computer. Then we'll create a new React app using Create React App, which provides a modern build setup with no configuration.",
          order: 2,
          duration: 20
        },
        {
          title: "Your First React Component",
          content: "Components are the building blocks of React applications. In this lesson, we'll create your first React component - a simple function that returns JSX. We'll learn about JSX syntax and how it differs from regular HTML.",
          order: 3,
          duration: 25
        }
      ]
    },
    {
      _id: '2',
      title: "JavaScript ES6+ Features",
      description: "Master modern JavaScript features including arrow functions, destructuring, async/await, and more.",
      category: "Programming",
      difficulty: "Intermediate",
      author: "JS Master",
      tags: ["JavaScript", "ES6", "Programming"],
      estimatedTime: 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        {
          title: "Arrow Functions and Lexical This",
          content: "Arrow functions provide a shorter syntax for writing functions and have a different behavior with the 'this' keyword. Learn when and how to use arrow functions effectively in your code.",
          order: 1,
          duration: 25
        },
        {
          title: "Destructuring Assignment", 
          content: "Destructuring allows you to extract values from arrays and objects into distinct variables. This feature makes your code more readable and concise.",
          order: 2,
          duration: 30
        }
      ]
    },
    {
      _id: '3',
      title: "MongoDB Fundamentals",
      description: "Learn database concepts, MongoDB operations, and how to work with NoSQL databases.",
      category: "Database",
      difficulty: "Beginner",
      author: "Database Expert",
      tags: ["MongoDB", "Database", "NoSQL"],
      estimatedTime: 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        {
          title: "Introduction to NoSQL and MongoDB",
          content: "MongoDB is a document-oriented NoSQL database. Unlike traditional relational databases, MongoDB stores data in flexible, JSON-like documents.",
          order: 1,
          duration: 20
        }
      ]
    }
  ];

  global.mockUsers = [];
  console.log('Mock data initialized with 3 sample tutorials');
}

// Seed initial tutorial data
async function seedDatabase() {
  const Tutorial = require('./models/Tutorial');
  
  try {
    const existingTutorials = await Tutorial.countDocuments();
    if (existingTutorials === 0) {
      const sampleTutorials = [
        {
          title: "Introduction to React",
          description: "Learn the fundamentals of React.js, including components, state, and props.",
          category: "Web Development",
          difficulty: "Beginner",
          author: "Tutorial Expert",
          tags: ["React", "JavaScript", "Frontend"],
          estimatedTime: 180,
          lessons: [
            {
              title: "What is React?",
              content: "React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Facebook and the open-source community. React allows you to create reusable UI components and manage application state efficiently.",
              order: 1,
              duration: 15
            },
            {
              title: "Setting Up Your Development Environment",
              content: "Before we start coding, let's set up our development environment. You'll need Node.js installed on your computer. Then we'll create a new React app using Create React App, which provides a modern build setup with no configuration.",
              order: 2,
              duration: 20
            },
            {
              title: "Your First React Component",
              content: "Components are the building blocks of React applications. In this lesson, we'll create your first React component - a simple function that returns JSX. We'll learn about JSX syntax and how it differs from regular HTML.",
              order: 3,
              duration: 25
            },
            {
              title: "Understanding Props",
              content: "Props (short for properties) are how you pass data from parent components to child components. Think of props as function arguments - they allow you to make your components dynamic and reusable.",
              order: 4,
              duration: 30
            },
            {
              title: "State and Event Handling",
              content: "State allows components to store and manage data that can change over time. We'll learn how to use the useState hook to add state to functional components and handle user interactions like button clicks.",
              order: 5,
              duration: 35
            },
            {
              title: "Building a Todo App",
              content: "Let's put everything together by building a simple todo application. This project will reinforce everything you've learned about components, props, state, and event handling.",
              order: 6,
              duration: 45
            }
          ]
        },
        {
          title: "JavaScript ES6+ Features",
          description: "Master modern JavaScript features including arrow functions, destructuring, async/await, and more.",
          category: "Programming",
          difficulty: "Intermediate",
          author: "JS Master",
          tags: ["JavaScript", "ES6", "Programming"],
          estimatedTime: 150,
          lessons: [
            {
              title: "Arrow Functions and Lexical This",
              content: "Arrow functions provide a shorter syntax for writing functions and have a different behavior with the 'this' keyword. Learn when and how to use arrow functions effectively in your code.",
              order: 1,
              duration: 25
            },
            {
              title: "Destructuring Assignment",
              content: "Destructuring allows you to extract values from arrays and objects into distinct variables. This feature makes your code more readable and concise. We'll explore both array and object destructuring with practical examples.",
              order: 2,
              duration: 30
            },
            {
              title: "Template Literals and String Methods",
              content: "Template literals provide an easy way to create multi-line strings and embed expressions. We'll also explore new string methods like includes(), startsWith(), and endsWith().",
              order: 3,
              duration: 20
            },
            {
              title: "Promises and Async/Await",
              content: "Asynchronous programming is crucial in JavaScript. Learn how Promises work and how async/await makes asynchronous code easier to read and write. We'll build examples using fetch API.",
              order: 4,
              duration: 40
            },
            {
              title: "Classes and Modules",
              content: "ES6 introduced class syntax to JavaScript, making object-oriented programming more familiar to developers from other languages. We'll also explore ES6 modules for organizing your code.",
              order: 5,
              duration: 35
            }
          ]
        },
        {
          title: "MongoDB Fundamentals",
          description: "Learn database concepts, MongoDB operations, and how to work with NoSQL databases.",
          category: "Database",
          difficulty: "Beginner",
          author: "Database Expert",
          tags: ["MongoDB", "Database", "NoSQL"],
          estimatedTime: 200,
          lessons: [
            {
              title: "Introduction to NoSQL and MongoDB",
              content: "MongoDB is a document-oriented NoSQL database. Unlike traditional relational databases, MongoDB stores data in flexible, JSON-like documents. Learn the differences between SQL and NoSQL databases and when to use each.",
              order: 1,
              duration: 20
            },
            {
              title: "Installing MongoDB and MongoDB Compass",
              content: "Get MongoDB up and running on your system. We'll install MongoDB Community Edition and MongoDB Compass, a GUI tool for interacting with your databases. You'll also learn about MongoDB Atlas, the cloud solution.",
              order: 2,
              duration: 25
            },
            {
              title: "Documents, Collections, and Databases",
              content: "Understand the basic building blocks of MongoDB: documents (similar to rows in SQL), collections (similar to tables), and databases. Learn about BSON format and how data is stored.",
              order: 3,
              duration: 30
            },
            {
              title: "CRUD Operations",
              content: "Master the fundamental operations: Create, Read, Update, and Delete. Learn how to insert documents, query data with various filters, update existing documents, and remove data from collections.",
              order: 4,
              duration: 45
            },
            {
              title: "Indexing and Performance",
              content: "Indexes are crucial for query performance. Learn how to create different types of indexes, understand query execution plans, and optimize your database queries for better performance.",
              order: 5,
              duration: 35
            },
            {
              title: "Aggregation Pipeline",
              content: "The aggregation pipeline is MongoDB's framework for data aggregation. Learn how to group, filter, and transform your data using stages like $match, $group, $project, and $sort.",
              order: 6,
              duration: 45
            }
          ]
        }
      ];
      
      await Tutorial.insertMany(sampleTutorials);
      console.log('Sample tutorials seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://0.0.0.0:${PORT}`);
});