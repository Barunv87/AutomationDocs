const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  }
});

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  lessons: [lessonSchema],
  author: {
    type: String,
    default: 'Tutorial Author'
  },
  tags: [{
    type: String
  }],
  estimatedTime: {
    type: Number, // total time in minutes
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tutorial', tutorialSchema);