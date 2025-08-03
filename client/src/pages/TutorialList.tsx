import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorialApi } from '../services/api';
import { Tutorial } from '../types';
import './TutorialList.css';

const TutorialList: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
  });

  useEffect(() => {
    fetchTutorials();
  }, [filters]);

  const fetchTutorials = async () => {
    try {
      const response = await tutorialApi.getAllTutorials(filters);
      setTutorials(response.data);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const categories = ['Web Development', 'Programming', 'Database', 'Mobile Development'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="tutorial-list-page">
      <div className="container">
        <div className="page-header">
          <h1>All Tutorials</h1>
          <p>Discover and learn from our comprehensive collection of tutorials</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tutorials..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">All Difficulties</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        {/* Tutorial Grid */}
        {loading ? (
          <div className="loading">Loading tutorials...</div>
        ) : (
          <div className="tutorials-grid">
            {tutorials.length === 0 ? (
              <div className="no-results">
                <h3>No tutorials found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              tutorials.map((tutorial) => (
                <div key={tutorial._id} className="tutorial-card">
                  <div className="tutorial-header">
                    <span className={`difficulty-badge ${tutorial.difficulty.toLowerCase()}`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="category-badge">{tutorial.category}</span>
                  </div>
                  
                  <h3 className="tutorial-title">{tutorial.title}</h3>
                  <p className="tutorial-description">{tutorial.description}</p>
                  
                  <div className="tutorial-tags">
                    {tutorial.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialList;