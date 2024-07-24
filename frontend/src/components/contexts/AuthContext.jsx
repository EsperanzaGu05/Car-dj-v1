import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    if (token && name && email && userId) {
      console.log("Initial auth setup - userId:", userId);
      setAuth({ token, name, email, userId });
    } else {
      console.log("Initial auth setup - incomplete data in localStorage");
    }
    setLoading(false);
  }, []);

  const login = (token, name, email, userId) => {
    console.log("Login called with userId:", userId);
    if (!userId) {
      console.error("Login called without userId");
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
    const authData = { token, name, email, userId };
    setAuth(authData);
    console.log("Auth state after login:", authData);
  };

  const logout = () => {
    console.log("Logout called, removing user data from localStorage and auth state");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setAuth(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        throw new Error("No token or userId found");
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
      console.log("Refreshed user data:", userData);
      setAuth(prevAuth => {
        const newAuth = { ...prevAuth, ...userData, userId };
        console.log("Updated auth state after refresh:", newAuth);
        return newAuth;
      });
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };
  const updateSubscriptionStatus = async (status) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("No userId found");
      }
  
      // Update the local state without making a server request
      setAuth(prevAuth => {
        const newAuth = {
          ...prevAuth,
          subscription: {
            ...prevAuth.subscription,
            status: status
          },
          userId
        };
        console.log("Updated auth state after subscription update:", newAuth);
        return newAuth;
      });
  
      console.log("Subscription status updated locally to:", status);
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error; // Re-throw the error so it can be caught in the component
    }
  };
  console.log("Current auth state:", auth);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, refreshUser, updateSubscriptionStatus }}>
      {children}
    </AuthContext.Provider>
  );
};