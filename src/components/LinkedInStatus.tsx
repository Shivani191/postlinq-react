//src/components/LinkedInStatus.tsx
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LinkedInStatus: React.FC = () => {
  const { token, logout, setLinkedInStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLinkedInStatus('disconnected');
        return;
      }

      setLinkedInStatus('checking');

      try {
        const res = await fetch('https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/linkedin/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 404) {
          setLinkedInStatus('disconnected');
          if (res.status === 401) {
            logout();
            navigate('/login');
          }
        } else if (res.ok) {
          const isValid = await res.json();
          setLinkedInStatus(isValid ? 'connected' : 'disconnected');
        }
      } catch (error) {
        console.error('Error verifying LinkedIn token:', error);
        setLinkedInStatus('disconnected');
      }
    };
    verifyToken();
  }, [token, logout, navigate, setLinkedInStatus]);

  // This component no longer needs to display the status itself
  return null; 
};

export default LinkedInStatus;