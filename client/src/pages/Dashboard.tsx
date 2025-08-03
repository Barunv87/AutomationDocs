import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.username}!</h1>
          <p>Continue your learning journey</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{user.enrolledTutorials.length}</div>
            <div className="stat-label">Enrolled Tutorials</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {user.progress.filter(p => p.progress === 100).length}
            </div>
            <div className="stat-label">Completed Tutorials</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {user.progress.reduce((total, p) => total + p.completedLessons.length, 0)}
            </div>
            <div className="stat-label">Lessons Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Math.round(
                user.progress.reduce((total, p) => total + p.progress, 0) / 
                Math.max(user.progress.length, 1)
              )}%
            </div>
            <div className="stat-label">Average Progress</div>
          </div>
        </div>

        {user.enrolledTutorials.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No tutorials enrolled yet</h3>
            <p>Start your learning journey by enrolling in a tutorial</p>
            <Link to="/tutorials" className="btn btn-primary">
              Browse Tutorials
            </Link>
          </div>
        ) : (
          <div className="enrolled-tutorials">
            <h2>Your Tutorials</h2>
            <div className="tutorials-grid">
              {user.enrolledTutorials.map((tutorial) => {
                const progress = user.progress.find(p => p.tutorialId === tutorial._id);
                return (
                  <div key={tutorial._id} className="tutorial-card">
                    <div className="tutorial-header">
                      <span className={`difficulty-badge ${tutorial.difficulty.toLowerCase()}`}>
                        {tutorial.difficulty}
                      </span>
                      <span className="category-badge">{tutorial.category}</span>
                    </div>
                    
                    <h3 className="tutorial-title">{tutorial.title}</h3>
                    <p className="tutorial-description">{tutorial.description}</p>
                    
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress?.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {progress?.progress || 0}% Complete 
                        ({progress?.completedLessons.length || 0} of {tutorial.lessons.length} lessons)
                      </div>
                    </div>
                    
                    <div className="tutorial-footer">
                      <span className="author">by {tutorial.author}</span>
                      <Link to={`/tutorial/${tutorial._id}`} className="btn btn-primary">
                        {progress?.progress === 100 ? 'Review' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {user.progress.length === 0 ? (
            <div className="no-activity">
              <p>No recent activity. Start learning to see your progress here!</p>
            </div>
          ) : (
            <div className="activity-list">
              {user.progress
                .filter(p => p.completedLessons.length > 0)
                .slice(0, 5)
                .map((progress) => {
                  const tutorial = user.enrolledTutorials.find(t => t._id === progress.tutorialId);
                  if (!tutorial) return null;
                  
                  return (
                    <div key={progress.tutorialId} className="activity-item">
                      <div className="activity-icon">
                        {progress.progress === 100 ? '🎉' : '📖'}
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">
                          {progress.progress === 100 ? 'Completed' : 'Learning'} {tutorial.title}
                        </div>
                        <div className="activity-meta">
                          {progress.completedLessons.length} lessons completed • {progress.progress}% done
                        </div>
                      </div>
                      <Link to={`/tutorial/${tutorial._id}`} className="activity-action">
                        View
                      </Link>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;