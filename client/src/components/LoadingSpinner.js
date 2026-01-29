import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p className="loading-text">Fetching real-time market data...</p>
    </div>
  );
}

export default LoadingSpinner;
