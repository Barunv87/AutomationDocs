const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const progressSchema = new mongoose.Schema({
  tutorialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial',
    required: true
  },
  completedLessons: [{
    type: Number // lesson order numbers
  }],
  currentLesson: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date
  },
  progress: {
    type: Number, // percentage 0-100
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  progress: [progressSchema],
  enrolledTutorials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);