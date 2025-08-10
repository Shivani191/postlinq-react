import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newJwtToken = params.get('jwt_token');

    console.log("New JWT Token from URL:", newJwtToken); 

    if (newJwtToken) {
      // 🔑 If a new token is found, update the global state
      setToken(newJwtToken);
      // Redirect to the dashboard after a successful connection
      navigate('/dashboard'); 
    } else {
      // If the token is missing, something went wrong on the backend
      console.error('Failed to receive new JWT token from backend.');
      alert('Failed to connect to LinkedIn. Please try again.');
      // Redirect to a public page or an error page
      navigate('/dashboard');
    }
  }, [location, navigate, setToken]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Finalizing LinkedIn connection...</p>
    </div>
  );
};

export default LinkedInCallback;