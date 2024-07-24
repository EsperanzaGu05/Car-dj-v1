import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [daysLeft, setDaysLeft] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    console.log("Auth state in SubscriptionContext:", auth);
    console.log("UserId in SubscriptionContext:", auth?.userId);
  }, [auth]);

  const fetchUserSubscriptionStatus = useCallback(async () => {
    if (!auth || !auth.token) {
      console.log("No auth or token available for fetching subscription status");
      return;
    }

    console.log("Fetching subscription status for userId:", auth.userId);

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
      console.log("Fetched user data for userId:", auth.userId, userData);

      if (userData.subscription?.endDate) {
        const endDate = new Date(userData.subscription.endDate);
        const today = new Date();

        const timeDiff = endDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const daysRemaining = Math.max(0, daysDiff);

        console.log("Setting days left for userId:", auth.userId, daysRemaining);
        setDaysLeft(daysRemaining);
        setSubscriptionStatus(userData.subscription.status);
      } else {
        console.log("No end date found, setting defaults for userId:", auth.userId);
        setDaysLeft(0);
        setSubscriptionStatus(null);
      }
    } catch (error) {
      console.error('Error fetching user subscription status for userId:', auth.userId, error);
      setSubscriptionStatus(null);
      setDaysLeft(0);
    }
  }, [auth]);

  useEffect(() => {
    fetchUserSubscriptionStatus();
  }, [fetchUserSubscriptionStatus]);

  const handleBuySubscription = async () => {
    if (subscriptionStatus === 'Subscribed') {
      navigate('/manage-subscription');
      return;
    }


    try {
      console.log("Initiating subscription purchase for userId:", auth.userId);
      const response = await fetch('http://localhost:5000/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          email: auth.email,
          userId: auth.userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      console.log("Received Stripe session for userId:", auth.userId, session);

      if (session.url) {
        console.log("Redirecting to Stripe Checkout for userId:", auth.userId, session.url);
        return session.url;
      } else {
        console.error("No URL in session object for userId:", auth.userId, session);
        throw new Error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error initiating subscription purchase for userId:', auth.userId, error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    console.log('Current auth state in cancelSubscription:', auth);
    console.log('UserId in cancelSubscription:', auth?.userId);
    if (!auth || !auth.token || !auth.userId) {
      console.error('Missing authentication information for userId:', auth?.userId);
      return { success: false, message: 'Not authenticated or missing user ID' };
    }
  
    try {
      console.log("Sending cancellation request to server for userId:", auth.userId);
      const response = await fetch(`http://localhost:5000/api/subscription/cancel/${auth.userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log("Server response status for userId:", auth.userId, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response for userId:", auth.userId, errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Server response data for userId:", auth.userId, data);
  
      if (data.success) {
        setSubscriptionStatus('Cancelled');
        setDaysLeft(0);
        console.log("Subscription cancelled successfully for userId:", auth.userId);
      }
  
      return data;
    } catch (error) {
      console.error('Error in cancelSubscription for userId:', auth.userId, error);
      return { success: false, message: error.message };
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      daysLeft,
      subscriptionStatus,
      fetchUserSubscriptionStatus,
      handleBuySubscription,
      cancelSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);