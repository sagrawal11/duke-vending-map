import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Duke University Vending Machine Map</h1>
          <p className="hero-description">
            Find your favorite snacks and drinks across campus in seconds!
          </p>
          <div className="hero-buttons">
            <Link to="/map" className="btn btn-primary">View Map</Link>
            <Link to="/search" className="btn btn-secondary">Search Products</Link>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="features-section">
          <div className="feature">
            <h2>Find Any Snack</h2>
            <p>Search for your favorite snacks and drinks to locate them on campus.</p>
          </div>
          <div className="feature">
            <h2>Interactive Map</h2>
            <p>Browse our interactive map to discover vending machines near you.</p>
          </div>
          <div className="feature">
            <h2>Always Updated</h2>
            <p>Our database is regularly updated to ensure accurate information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
