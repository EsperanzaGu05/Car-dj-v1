// SubscriptionContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [daysLeft, setDaysLeft] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const fetchUserSubscriptionStatus = useCallback(async () => {
    if (!auth || !auth.token) return;

    try {
      const response = await fetch('http://localhost:5000/api/account/sub', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      console.log("Fetched user data:", userData);
      
      if (userData.subscription?.endDate) {
        const endDate = new Date(userData.subscription.endDate);
        const today = new Date();
        
        const timeDiff = endDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const daysRemaining = Math.max(0, daysDiff);
        
        console.log("Setting days left:", daysRemaining);
        setDaysLeft(daysRemaining);
        setSubscriptionStatus(userData.subscription.status);
      } else {
        console.log("No end date found, setting defaults");
        setDaysLeft(0);
        setSubscriptionStatus(null);
      }
    } catch (error) {
      console.error('Error fetching user subscription status:', error);
      setSubscriptionStatus(null);
      setDaysLeft(0);
    }
  }, [auth]);

  useEffect(() => {
    fetchUserSubscriptionStatus();
  }, [fetchUserSubscriptionStatus]);

  const handleBuySubscription = async () => {
    if (subscriptionStatus === 'Subscribed') {
      return '/manage-subscription';
    }

    try {
      console.log("Initiating subscription purchase");
      const response = await fetch('http://localhost:5000/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          email: auth.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      console.log("Received Stripe session:", session);
      
      if (session.url) {
        console.log("Redirecting to Stripe Checkout:", session.url);
        return session.url;
      } else {
        console.error("No URL in session object:", session);
        throw new Error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error initiating subscription purchase:', error);
      throw error;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      daysLeft, 
      subscriptionStatus, 
      fetchUserSubscriptionStatus, 
      handleBuySubscription 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);