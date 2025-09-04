import React, { useState, useEffect } from 'react';
import './FreeFoodPage.css';
import FreeFoodCard from '../components/FreeFoodCard';
import Navigation from '../components/Navigation';
import { fetchFreeFoodEvents } from '../services/dukeGroupsScraper';

function FreeFoodPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'this-week', 'this-month'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const freeFoodEvents = await fetchFreeFoodEvents();
      setEvents(freeFoodEvents);
    } catch (err) {
      setError('Failed to load free food events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    // Filter by time period - use local date parsing to avoid timezone issues
    const now = new Date();
    const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    if (filter === 'today') {
      return event.date === todayString;
    } else if (filter === 'this-week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekFromNowString = `${weekFromNow.getFullYear()}-${String(weekFromNow.getMonth() + 1).padStart(2, '0')}-${String(weekFromNow.getDate()).padStart(2, '0')}`;
      return event.date >= todayString && event.date <= weekFromNowString;
    } else if (filter === 'this-month') {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const [eventYear, eventMonth] = event.date.split('-').map(Number);
      return eventMonth === currentMonth + 1 && eventYear === currentYear; // month is 0-indexed in JS
    }
    
    // Filter by search term
    if (searchTerm) {
      return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
             event.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="free-food-page">
        <div className="page-container">
          <Navigation />
          <div className="content-container">
            <div className="container main-content">
              <div className="loading-section">
                <div className="loading-spinner"></div>
                <p>Loading free food events...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="free-food-page">
        <div className="page-container">
          <Navigation />
          <div className="content-container">
            <div className="container main-content">
              <div className="error-section">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button onClick={loadEvents} className="retry-button">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="free-food-page">
      <div className="page-container">
        <Navigation />
        <div className="content-container">
          <div className="container main-content">
        <div className="search-section">
          <h2>Find Free Food Events</h2>
          
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events, locations, or food types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button 
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filter === 'this-week' ? 'active' : ''}`}
              onClick={() => setFilter('this-week')}
            >
              This Week
            </button>
            <button 
              className={`filter-btn ${filter === 'this-month' ? 'active' : ''}`}
              onClick={() => setFilter('this-month')}
            >
              This Month
            </button>
          </div>
        </div>
        
        {/* Events List */}
        <div className="events-section">
          <h3>
            {filteredEvents.length} Free Food Event{filteredEvents.length !== 1 ? 's' : ''} Found
          </h3>
          
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>No free food events found for your current filters.</p>
              <p>Try adjusting your search or checking back later!</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <FreeFoodCard key={index} event={event} />
              ))}
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeFoodPage;
