
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider, AuthContext } from "./components/contexts/AuthContext";
import "./components/LoginSection/Login.css";
import GoogleLoginCallback from './components/LoginSection/GoogleLoginCallback';
import Layout from "./shared/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Artists from "./Pages/Home/Artists.jsx";
import Albums from "./Pages/Home/Albums.jsx";
import Playlists from "./Pages/Home/Playlists.jsx";


function App() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const message = urlParams.get('message');

    if (status === 'success' && token && name && email) {
      login(token, name, email);
      navigate('/', { replace: true });
    } else if (status === 'error' && message) {
      console.error(decodeURIComponent(message));
      navigate('/login', { replace: true, state: { error: decodeURIComponent(message) } });
    } else if (status === 'success' && message) {
      console.log(decodeURIComponent(message));
      navigate('/login', { replace: true, state: { message: decodeURIComponent(message) } });
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [login, navigate, location]);

  return (
    <AuthProvider>
      <Router>
    <div id="main-container">
      <Routes>
            <Route
              path="/"
              element={
                <Layout id="home">
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/artists"
              element={
                <Layout id="artist">
                  <Artists />
                </Layout>
              }
            />
            <Route
              path="/albums"
              element={
                <Layout id="albums">
                  <Albums />
                </Layout>
              }
            />
            <Route
              path="/playlist"
              element={
                <Layout id="playlist">
                  <Playlists />
                </Layout>
              }
            />
        <Route path="/verify" element={<Verify />} />
        <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/login"  />
        <Route path="/google/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleLoginCallback />} />
      </Routes>
    </div>
  </Router>
    </AuthProvider>
  );
}
export default App;