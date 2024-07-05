import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const GoogleLoginCallback = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const name = urlParams.get('name');
      const email = urlParams.get('email');

      if (token && name && email) {
        console.log('Google login successful', { token, name, email });
        login(token, name, email);
        navigate('/account'); // Redirect to account page after login
      } else {
        console.error('Google login failed: Missing token, name, or email');
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [login, navigate]);

  return <div>Processing Google login...</div>;
};

export default GoogleLoginCallback;