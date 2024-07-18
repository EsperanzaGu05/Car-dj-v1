import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, updateSubscriptionStatus, refreshUser, login } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      if (auth && auth.token) {
        handlePaymentSuccess(sessionId);
      } else {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        
        if (token && name && email) {
          login(token, name, email);
          handlePaymentSuccess(sessionId);
        } else {
          console.error('Authentication token not available');
          navigate('/login');
        }
      }
    } else {
      setIsProcessing(false);
      navigate('/');
    }
  }, [location, auth, navigate, login]);

  const handlePaymentSuccess = async (sessionId) => {
    try {
      const token = auth?.token || localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/payment/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message === 'Subscription updated successfully') {
        await updateSubscriptionStatus('Subscribed');
        await refreshUser();
        navigate('/', { state: { showSubscriptionSuccess: true } });
      } else {
        navigate('/', { state: { showSubscriptionError: true } });
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      navigate('/', { state: { showSubscriptionError: true } });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <div>Processing your payment...</div>;
  }

  return null;
};

export default PaymentSuccess;