import React from 'react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick, isMinimized }) => {
  return (
    <button 
      className={`floating-action-button ${isMinimized ? 'minimized' : ''}`}
      onClick={onClick}
      aria-label="Report missing vending machine or changed products"
    >
      {isMinimized ? (
        <span className="fab-icon">📝</span>
      ) : (
        <span className="fab-text">Report Missing Vending Machine or Changed Products</span>
      )}
    </button>
  );
};

export default FloatingActionButton;
