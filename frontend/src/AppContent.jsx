
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MainContent = ({ children }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const msg = params.get('message');

    if (status && msg) {
      setMessage(decodeURIComponent(msg));
      setMessageType(status);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
        navigate(location.pathname, { replace: true });
      }, 5000);
    }
  }, [location, navigate]);

  return (
    <main className="main-content">
      {message && (
        <div className={`alert ${messageType}-alert`} style={{
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: messageType === 'error' ? '#f8d7da' : '#d4edda',
          color: messageType === 'error' ? '#721c24' : '#155724',
          border: `1px solid ${messageType === 'error' ? '#f5c6cb' : '#c3e6cb'}`,
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}
      {children}
    </main>
  );
};

export default MainContent;