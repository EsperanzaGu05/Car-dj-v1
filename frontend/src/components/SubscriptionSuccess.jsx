import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  useEffect(() => {
    const updateUserSubscription = async () => {
      await refreshUser();
      navigate('/');
    };

    updateUserSubscription();
  }, [refreshUser, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <h1 style={{ color: '#4CAF50' }}>Subscription Successful!</h1>
      <p>Thank you for subscribing to our premium service.</p>
      <p>You will be redirected to the homepage shortly...</p>
    </div>
  );
};

export default SubscriptionSuccess;