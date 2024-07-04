<<<<<<< HEAD
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
=======

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
>>>>>>> eb1faec4dd693945ae90e52e9113b102c38926b9
import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider, AuthContext } from "./components/contexts/AuthContext";
import "./components/LoginSection/Login.css";
import GoogleLoginCallback from './components/LoginSection/GoogleLoginCallback';
import MainContent from "./components/HomeContent/MainContent";
import { getNewRealeases } from "./utils/utils/index";

function AppContent() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [trackReleases, setTrackReleases] = useState([]);
  const [albumReleases, setAlbumReleases] = useState([]);

<<<<<<< HEAD
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

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const initialData = await getNewRealeases();
        if (initialData && initialData.albums && initialData.albums.items) {
          const tracks = initialData.albums.items.filter(item => item.album_type === "single");
          const albums = initialData.albums.items.filter(item => item.album_type === "album");
          setTrackReleases(tracks);
          setAlbumReleases(albums);
        }
      } catch (error) {
        console.error("Error fetching releases:", error);
      }
    };
    fetchRelease();
  }, []);

  return (
    <div id="main-container">
      <AsideBar />
      <div className="main-content-area">
        <SearchBar />
        <MainContent
          trackReleases={trackReleases}
          albumReleases={albumReleases}
        />
      </div>
      <Routes>
        <Route path="/verify" element={<Verify />} />
        <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/login"  />
        <Route path="/google/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleLoginCallback />} />
      </Routes>
    </div>
  );
}
=======
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/LoginSection/Login.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ForgotPassword from "./components/LoginSection/ForgotPassword";
import ResetPassword from "./components/LoginSection/Resetpassword";
import MainContent from "./components/HomeContent/MainContent";
import { getNewRealeases } from "./utils/utils/index";

>>>>>>> eb1faec4dd693945ae90e52e9113b102c38926b9

function App() {
  const [trackReleases, setTrackReleases] = useState();
  const [albumReleases, setAlbumReleases] = useState();

  const fetchRelease = async () => {
    let trackReleases = [];
    let albumReleases = [];

    try {
      // Initial request to get the total number of items
      const initialData = await getNewRealeases();
      if (initialData && initialData.albums && initialData.albums.items) {
        trackReleases = initialData.albums.items.filter(
          (item) => item.album_type === "single"
        );
        albumReleases = initialData.albums.items.filter(
          (item) => item.album_type === "album"
        );
        console.log(trackReleases);
      }
      setTrackReleases(trackReleases);
      setAlbumReleases(albumReleases);
    } catch (error) {
      console.error("Error fetching releases:", error);
    }
  };
  useEffect(() => {
    fetchRelease();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>

    <Router>
      <div id="main-container">
        <AsideBar />
        <div className="main-content-area">
          <SearchBar />
          <MainContent
            trackReleases={trackReleases}
            albumReleases={albumReleases}
          />
        </div>
      </div>
      <Routes>
        <Route path="/verify" element={<Verify />} />
        <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Other routes */}
      </Routes>
      <footer>Copyright 2024 Car DJ</footer>
    </Router>
  );
}

export default App;