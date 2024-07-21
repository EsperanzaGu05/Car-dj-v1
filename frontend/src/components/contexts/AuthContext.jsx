// AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    if (token && name && email) {
      setAuth({ token, name, email });
    }
    setLoading(false);
  }, []);

  const login = (token, name, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setAuth({ token, name, email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setAuth(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch('http://localhost:5000/api/account/sub', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setAuth(prevAuth => ({ ...prevAuth, ...userData }));
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const updateSubscriptionStatus = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await fetch('http://localhost:5000/api/updateSubscription', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
  
      if (!response.ok) {
        throw new Error("Failed to update subscription status");
      }
  
      const updatedSubscriptionData = await response.json();
  
      setAuth(prevAuth => ({
        ...prevAuth,
        subscription: updatedSubscriptionData
      }));
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, refreshUser, updateSubscriptionStatus }}>
      <section>{children}</section>
    </AuthContext.Provider>
  );
};
