import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider } from "./components/contexts/AuthContext";
import "./components/LoginSection/Login.css";
import ForgotPassword from "./components/LoginSection/ForgotPassword";
import MainContent from "./components/HomeContent/MainContent";
import SearchResults from "./components/SearchResults/SearchResults";
import { getNewRealeases, searchSpotify } from "./utils/utils/index";

function App() {
  const [trackReleases, setTrackReleases] = useState();
  const [albumReleases, setAlbumReleases] = useState();
  const [searchResults, setSearchResults] = useState();

  const fetchRelease = async () => {
    let trackReleases = [];
    let albumReleases = [];

    try {
      const initialData = await getNewRealeases();
      if (initialData && initialData.albums && initialData.albums.items) {
        trackReleases = initialData.albums.items.filter(
          (item) => item.album_type === "single"
        );
        albumReleases = initialData.albums.items.filter(
          (item) => item.album_type === "album"
        );
      }
      setTrackReleases(trackReleases);
      setAlbumReleases(albumReleases);
    } catch (error) {
      console.error("Error fetching releases:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const results = await searchSpotify(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error performing search:", error);
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
          <div className="main-content-area">
            <SearchBar onSearch={handleSearch} />
            <Routes>
              <Route
                path="/search"
                element={<SearchResults searchResults={searchResults} />}
              />
              <Route
                path="/"
                element={
                  <MainContent
                    trackReleases={trackReleases}
                    albumReleases={albumReleases}
                  />
                }
              />
              <Route path="/verify" element={<Verify />} />
              <Route
                path="/api/register/pending/:id/:secret"
                element={<Verify />}
              />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
