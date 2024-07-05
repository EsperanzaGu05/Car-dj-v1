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
import { getNewRealeases, getAlbums, getArtists } from "./utils/utils/index";
import ContentAlbums from "./components/Content/ContentAlbums.jsx";
import Content from "./components/Content/ContentArtists.jsx";
import Layout from "./shared/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Artists from "./Pages/Home/Artists.jsx";
import Albums from "./Pages/Home/Albums.jsx";
import Playlists from "./Pages/Home/Playlists.jsx";

function App() {
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

            {/* <Route path="/verify" element={<Verify />} />
            <Route
              path="/api/register/pending/:id/:secret"
              element={<Verify />}
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
