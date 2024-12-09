import React from 'react';
import { Link } from 'react-router-dom';

const MarketingPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
};

export default MarketingPage;