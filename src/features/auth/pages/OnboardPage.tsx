import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api/authApi.ts';

const OnboardPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOnboard = async () => {
    try {
      const response = await authApi.onboard({ 
        firstName, 
        middleName: middleName || undefined, 
        lastName 
      });
      
      if (response.data.status) {
        navigate('/home');
      } else {
        setError('Onboarding failed!');
      }
    } catch (err) {
      setError('Onboarding failed!');
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input 
        type="text" 
        value={firstName} 
        onChange={(e) => setFirstName(e.target.value)} 
        placeholder="First Name" 
        required 
      />
      <input 
        type="text" 
        value={middleName} 
        onChange={(e) => setMiddleName(e.target.value)} 
        placeholder="Middle Name (Optional)" 
      />
      <input 
        type="text" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} 
        placeholder="Last Name" 
        required 
      />
      <button onClick={handleOnboard}>Complete Profile</button>
    </div>
  );
};

export default OnboardPage;