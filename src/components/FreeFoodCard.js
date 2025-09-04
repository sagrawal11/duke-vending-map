import React from 'react';
import './FreeFoodCard.css';

const FreeFoodCard = ({ event }) => {
  const formatDate = (dateString) => {
    // Parse the date string to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getEventType = (title, description) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('shabbat') || text.includes('jewish')) return 'Jewish Life';
    if (text.includes('popsicle') || text.includes('ice cream')) return 'Frozen Treats';
    if (text.includes('lunch') || text.includes('power lunch')) return 'Lunch';
    if (text.includes('brunch') || text.includes('bagel')) return 'Brunch';
    if (text.includes('breakfast') || text.includes('bagel')) return 'Breakfast';
    if (text.includes('reception') || text.includes('opening')) return 'Reception';
    if (text.includes('social') || text.includes('meet')) return 'Social';
    if (text.includes('fair') || text.includes('festival')) return 'Fair/Festival';
    if (text.includes('dinner')) return 'Dinner';
    
    return 'Free Food';
  };

  const eventType = getEventType(event.title, event.description);

  return (
    <div className="free-food-card">
      <div className="card-header">
        <div className="event-type-badge">
          {eventType}
        </div>
        <div className="event-date">
          {formatDate(event.date)}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="event-title">{event.title}</h3>
        
        {event.time && (
          <div className="event-time">
            <span className="time-icon">🕒</span>
            {formatTime(event.time)}
          </div>
        )}
        
        {event.location && (
          <div className="event-location">
            <span className="location-icon">📍</span>
            {event.location}
          </div>
        )}
        
        {event.description && (
          <div className="event-description">
            <p>{event.description}</p>
          </div>
        )}
        
        {event.sponsor && (
          <div className="event-sponsor">
            <span className="sponsor-icon">👥</span>
            <span className="sponsor-text">Hosted by: {event.sponsor}</span>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default FreeFoodCard;
