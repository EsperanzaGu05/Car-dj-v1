
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider } from "./components/contexts/AuthContext";


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
        <div id="main-container">
          <AsideBar />
          
            <SearchBar />
            
              <Routes>
                
                <Route path="/verify" element={<Verify />} />
                <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            
          </div>
        
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