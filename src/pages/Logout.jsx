import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all authentication data from localStorage
    window.localStorage.removeItem('isAuthenticated');
    window.localStorage.removeItem('currentUsername');
    
    console.log('Logout complete - localStorage cleared');
    console.log('isAuthenticated =', window.localStorage.getItem('isAuthenticated'));
    console.log('currentUsername =', window.localStorage.getItem('currentUsername'));
    
    // Navigate to login page
    navigate('/login');
  }, [navigate]);

  // This component doesn't render anything
  return null;
}