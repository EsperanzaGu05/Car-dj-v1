import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = () => {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
      setLoading(false);
    };
    loadAuthState();
  }, []);

  const login = (token, name, email) => {
    const authData = { token, name, email };
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};