import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <div className="tab-navigation">
      <Link 
        to="/"
        className={`tab ${location.pathname === '/' ? 'active' : ''}`}
      >
        🥤 Vending Machines
      </Link>
      <Link 
        to="/free-food"
        className={`tab ${location.pathname === '/free-food' ? 'active' : ''}`}
      >
        🍕 Free Food
      </Link>
    </div>
  );
};

export default Navigation;
