import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/services/api/authApi.ts';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("calling: authApi.logout()");
      await authApi.logout();
      console.log("worked: authApi.logout()");

      navigate('/');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  return (
    <div>
      <h1>Welcome Home</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;