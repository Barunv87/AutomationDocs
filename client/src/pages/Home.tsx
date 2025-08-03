import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorialApi } from '../services/api';
import { Tutorial } from '../types';
import './Home.css';

const Home: React.FC = () => {
  const [featuredTutorials, setFeaturedTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTutorials = async () => {
      try {
        const response = await tutorialApi.getAllTutorials();
        setFeaturedTutorials(response.data.slice(0, 3)); // Get first 3 tutorials
      } catch (error) {
        console.error('Error fetching featured tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTutorials();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn Something New Today
            </h1>
            <p className="hero-subtitle">
              Discover comprehensive tutorials on programming, web development, and technology.
              Start your learning journey with our interactive lessons and hands-on projects.
            </p>
            <div className="hero-buttons">
              <Link to="/tutorials" className="btn btn-primary large">
                Browse Tutorials
              </Link>
              <Link to="/register" className="btn btn-outline large">
                Get Started Free
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-element">💻</div>
              <div className="graphic-element">📚</div>
              <div className="graphic-element">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Interactive Learning</h3>
              <p>Hands-on lessons with real-world projects and practical exercises.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Track Progress</h3>
              <p>Monitor your learning journey with detailed progress tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Expert Authors</h3>
              <p>Learn from industry professionals and experienced developers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutorials Section */}
      <section className="featured-tutorials">
        <div className="container">
          <h2 className="section-title">Featured Tutorials</h2>
          {loading ? (
            <div className="loading">Loading tutorials...</div>
          ) : (
            <div className="tutorials-grid">
              {featuredTutorials.map((tutorial) => (
                <div key={tutorial._id} className="tutorial-card">
                  <div className="tutorial-header">
                    <span className="difficulty-badge">{tutorial.difficulty}</span>
                    <span className="category-badge">{tutorial.category}</span>
                  </div>
                  <h3 className="tutorial-title">{tutorial.title}</h3>
                  <p className="tutorial-description">{tutorial.description}</p>
                  <div className="tutorial-meta">
                    <span className="duration">⏱️ {tutorial.estimatedTime} min</span>
                    <span className="lessons">📝 {tutorial.lessons.length} lessons</span>
                  </div>
                  <div className="tutorial-footer">
                    <span className="author">by {tutorial.author}</span>
                    <Link to={`/tutorial/${tutorial._id}`} className="btn btn-primary">
                      Start Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/tutorials" className="btn btn-outline">
              View All Tutorials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;