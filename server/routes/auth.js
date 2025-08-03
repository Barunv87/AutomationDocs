const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Only require models if we're not using mock data
let User;
try {
  User = require('../models/User');
} catch (error) {
  // Model will be undefined if using mock data
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (global.usingMockData) {
      // Simple mock user creation
      const existingUser = global.mockUsers.find(u => u.email === email || u.username === username);
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with this email or username already exists' 
        });
      }
      
      const mockUser = {
        id: (global.mockUsers.length + 1).toString(),
        username,
        email,
        enrolledTutorials: [],
        progress: []
      };
      global.mockUsers.push(mockUser);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: mockUser.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: 'User created successfully (mock mode)',
        token,
        user: mockUser
      });
    } else {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with this email or username already exists' 
        });
      }
      
      // Create new user
      const user = new User({ username, email, password });
      await user.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (global.usingMockData) {
      // Simple mock authentication - just check if user exists
      const user = global.mockUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );
      
      res.json({
        message: 'Login successful (mock mode)',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          enrolledTutorials: user.enrolledTutorials,
          progress: user.progress
        }
      });
    } else {
      // Find user by email
      const user = await User.findOne({ email }).populate('enrolledTutorials');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          enrolledTutorials: user.enrolledTutorials,
          progress: user.progress
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    if (global.usingMockData) {
      const user = global.mockUsers.find(u => u.id === req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } else {
      const user = await User.findById(req.params.userId)
        .populate('enrolledTutorials')
        .select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;