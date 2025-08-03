const express = require('express');
const router = express.Router();

// Only require models if we're not using mock data
let Tutorial, User;
try {
  Tutorial = require('../models/Tutorial');
  User = require('../models/User');
} catch (error) {
  // Models will be undefined if using mock data
}

// Get all tutorials
router.get('/', async (req, res) => {
  try {
    if (global.usingMockData) {
      // Use mock data
      const { category, difficulty, search } = req.query;
      let tutorials = [...global.mockTutorials];
      
      if (category) {
        tutorials = tutorials.filter(t => t.category === category);
      }
      if (difficulty) {
        tutorials = tutorials.filter(t => t.difficulty === difficulty);
      }
      if (search) {
        tutorials = tutorials.filter(t => 
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      res.json(tutorials);
    } else {
      // Use MongoDB
      const { category, difficulty, search } = req.query;
      let query = {};
      
      if (category) query.category = category;
      if (difficulty) query.difficulty = difficulty;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      const tutorials = await Tutorial.find(query).sort({ createdAt: -1 });
      res.json(tutorials);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single tutorial by ID
router.get('/:id', async (req, res) => {
  try {
    if (global.usingMockData) {
      const tutorial = global.mockTutorials.find(t => t._id === req.params.id);
      if (!tutorial) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
      res.json(tutorial);
    } else {
      const tutorial = await Tutorial.findById(req.params.id);
      if (!tutorial) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
      res.json(tutorial);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new tutorial
router.post('/', async (req, res) => {
  try {
    if (global.usingMockData) {
      const newTutorial = {
        _id: (global.mockTutorials.length + 1).toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      global.mockTutorials.push(newTutorial);
      res.status(201).json(newTutorial);
    } else {
      const tutorial = new Tutorial(req.body);
      const savedTutorial = await tutorial.save();
      res.status(201).json(savedTutorial);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update tutorial
router.put('/:id', async (req, res) => {
  try {
    if (global.usingMockData) {
      const index = global.mockTutorials.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
      global.mockTutorials[index] = {
        ...global.mockTutorials[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      res.json(global.mockTutorials[index]);
    } else {
      const tutorial = await Tutorial.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!tutorial) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
      res.json(tutorial);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete tutorial
router.delete('/:id', async (req, res) => {
  try {
    if (global.usingMockData) {
      const index = global.mockTutorials.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
      global.mockTutorials.splice(index, 1);
      res.json({ message: 'Tutorial deleted successfully' });
    } else {
      const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
      if (!tutorial) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
      res.json({ message: 'Tutorial deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in tutorial
router.post('/:id/enroll', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (global.usingMockData) {
      // For demo purposes, just return success in mock mode
      res.json({ message: 'Enrolled successfully (mock mode)' });
    } else {
      const tutorial = await Tutorial.findById(req.params.id);
      const user = await User.findById(userId);
      
      if (!tutorial || !user) {
        return res.status(404).json({ message: 'Tutorial or user not found' });
      }
      
      if (!user.enrolledTutorials.includes(tutorial._id)) {
        user.enrolledTutorials.push(tutorial._id);
        user.progress.push({
          tutorialId: tutorial._id,
          completedLessons: [],
          currentLesson: 1,
          progress: 0
        });
        await user.save();
      }
      
      res.json({ message: 'Enrolled successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lesson progress
router.post('/:tutorialId/progress', async (req, res) => {
  try {
    const { userId, lessonOrder } = req.body;
    
    if (global.usingMockData) {
      // For demo purposes, just return success in mock mode
      res.json({ progress: 50 });
    } else {
      const user = await User.findById(userId);
      const tutorial = await Tutorial.findById(req.params.tutorialId);
      
      if (!user || !tutorial) {
        return res.status(404).json({ message: 'User or tutorial not found' });
      }
      
      const progressIndex = user.progress.findIndex(
        p => p.tutorialId.toString() === req.params.tutorialId
      );
      
      if (progressIndex === -1) {
        return res.status(404).json({ message: 'User not enrolled in this tutorial' });
      }
      
      const userProgress = user.progress[progressIndex];
      
      if (!userProgress.completedLessons.includes(lessonOrder)) {
        userProgress.completedLessons.push(lessonOrder);
        userProgress.currentLesson = Math.max(userProgress.currentLesson, lessonOrder + 1);
        userProgress.progress = Math.round((userProgress.completedLessons.length / tutorial.lessons.length) * 100);
        
        if (userProgress.progress === 100) {
          userProgress.completedAt = new Date();
        }
        
        await user.save();
      }
      
      res.json({ progress: userProgress.progress });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;