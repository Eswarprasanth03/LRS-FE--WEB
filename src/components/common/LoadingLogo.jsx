import React from 'react';
import './LoadingLogo.css';

const LoadingLogo = ({ size = 64 }) => (
  <div className="loading-logo-wrapper">
    <img
      src={require('../../assets/logomain.png')}
      alt="Loading..."
      className="loading-logo-img"
      style={{ width: size, height: 'auto' }}
    />
  </div>
);

export default LoadingLogo; 