import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tutorialApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Tutorial, Lesson, UserProgress } from '../types';
import './TutorialViewer.css';

const TutorialViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (id) {
      fetchTutorial();
    }
  }, [id]);

  useEffect(() => {
    if (tutorial && user) {
      checkEnrollmentStatus();
    }
  }, [tutorial, user]);

  const fetchTutorial = async () => {
    try {
      const response = await tutorialApi.getTutorial(id!);
      setTutorial(response.data);
    } catch (error) {
      console.error('Error fetching tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = () => {
    if (!tutorial || !user) return;
    
    const isEnrolled = user.enrolledTutorials.some(t => t._id === tutorial._id);
    setEnrolled(isEnrolled);
    
    if (isEnrolled) {
      const progress = user.progress.find(p => p.tutorialId === tutorial._id);
      setUserProgress(progress || null);
      if (progress) {
        setCurrentLessonIndex(Math.max(0, progress.currentLesson - 1));
      }
    }
  };

  const handleEnroll = async () => {
    if (!tutorial || !user) {
      navigate('/login');
      return;
    }

    try {
      await tutorialApi.enrollInTutorial(tutorial._id, user.id);
      setEnrolled(true);
      // You might want to refresh user data here
    } catch (error) {
      console.error('Error enrolling in tutorial:', error);
    }
  };

  const handleLessonComplete = async (lessonIndex: number) => {
    if (!tutorial || !user || !enrolled) return;

    try {
      const lesson = tutorial.lessons[lessonIndex];
      await tutorialApi.updateProgress(tutorial._id, user.id, lesson.order);
      
      // Update local progress state
      if (userProgress) {
        const updatedProgress = {
          ...userProgress,
          completedLessons: [...userProgress.completedLessons, lesson.order],
          currentLesson: Math.max(userProgress.currentLesson, lesson.order + 1),
          progress: Math.round(((userProgress.completedLessons.length + 1) / tutorial.lessons.length) * 100)
        };
        setUserProgress(updatedProgress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const navigateToLesson = (index: number) => {
    setCurrentLessonIndex(index);
  };

  if (loading) {
    return <div className="loading">Loading tutorial...</div>;
  }

  if (!tutorial) {
    return <div className="error">Tutorial not found</div>;
  }

  const currentLesson = tutorial.lessons[currentLessonIndex];
  const isLessonCompleted = userProgress?.completedLessons.includes(currentLesson.order) || false;

  return (
    <div className="tutorial-viewer">
      <div className="tutorial-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="tutorial-info">
            <h2>{tutorial.title}</h2>
            <p className="tutorial-meta">
              {tutorial.lessons.length} lessons • {tutorial.estimatedTime} minutes
            </p>
            
            {!enrolled ? (
              <button className="btn btn-primary full-width" onClick={handleEnroll}>
                {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
              </button>
            ) : (
              <div className="progress-info">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${userProgress?.progress || 0}%` }}
                  ></div>
                </div>
                <p>{userProgress?.progress || 0}% Complete</p>
              </div>
            )}
          </div>

          <div className="lessons-list">
            <h3>Lessons</h3>
            {tutorial.lessons.map((lesson, index) => (
              <div
                key={lesson.order}
                className={`lesson-item ${index === currentLessonIndex ? 'active' : ''} ${
                  userProgress?.completedLessons.includes(lesson.order) ? 'completed' : ''
                }`}
                onClick={() => enrolled && navigateToLesson(index)}
              >
                <div className="lesson-number">{lesson.order}</div>
                <div className="lesson-details">
                  <h4>{lesson.title}</h4>
                  <span className="lesson-duration">{lesson.duration} min</span>
                </div>
                {userProgress?.completedLessons.includes(lesson.order) && (
                  <div className="lesson-status">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {enrolled ? (
            <>
              <div className="lesson-header">
                <h1>{currentLesson.title}</h1>
                <div className="lesson-nav">
                  <button
                    className="btn btn-outline"
                    onClick={() => navigateToLesson(Math.max(0, currentLessonIndex - 1))}
                    disabled={currentLessonIndex === 0}
                  >
                    ← Previous
                  </button>
                  <span className="lesson-counter">
                    {currentLessonIndex + 1} of {tutorial.lessons.length}
                  </span>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigateToLesson(Math.min(tutorial.lessons.length - 1, currentLessonIndex + 1))}
                    disabled={currentLessonIndex === tutorial.lessons.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="lesson-content">
                <div className="content-text">
                  {currentLesson.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                {currentLesson.videoUrl && (
                  <div className="video-container">
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              <div className="lesson-footer">
                {!isLessonCompleted && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleLessonComplete(currentLessonIndex)}
                  >
                    Mark as Complete
                  </button>
                )}
                {isLessonCompleted && (
                  <span className="completion-badge">✓ Completed</span>
                )}
              </div>
            </>
          ) : (
            <div className="enrollment-prompt">
              <h1>{tutorial.title}</h1>
              <p className="description">{tutorial.description}</p>
              
              <div className="tutorial-details">
                <div className="detail-item">
                  <strong>Author:</strong> {tutorial.author}
                </div>
                <div className="detail-item">
                  <strong>Difficulty:</strong> {tutorial.difficulty}
                </div>
                <div className="detail-item">
                  <strong>Category:</strong> {tutorial.category}
                </div>
                <div className="detail-item">
                  <strong>Estimated Time:</strong> {tutorial.estimatedTime} minutes
                </div>
              </div>

              <div className="tags-section">
                <strong>Tags:</strong>
                <div className="tags">
                  {tutorial.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary large" onClick={handleEnroll}>
                {isAuthenticated ? 'Enroll in This Tutorial' : 'Login to Start Learning'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialViewer;