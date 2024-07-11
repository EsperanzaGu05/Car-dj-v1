import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider, AuthContext } from "./components/contexts/AuthContext";
import "./components/LoginSection/Login.css";
import GoogleLoginCallback from "./components/LoginSection/GoogleLoginCallback";
import Layout from "./shared/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Artists from "./Pages/Home/Artists.jsx";
import Albums from "./Pages/Home/Albums.jsx";
import Playlists from "./Pages/Home/Playlists.jsx";
import ArtistsDetailes from "./Pages/Home/ArtistsDetailes.jsx";
import AlbumsDetails from "./Pages/Home/AlbumsDetails.jsx";

const playlist = [
  {
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    name: "song 1",
  },
  {
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    name: "song 2",
  },
  {
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    name: "song 3",
  },
];

function AppContent() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get("status");
    const token = urlParams.get("token");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const message = urlParams.get("message");

    if (status === "success" && token && name && email) {
      login(token, name, email);
      navigate("/", { replace: true });
    } else if (status === "error" && message) {
      console.error(decodeURIComponent(message));
      navigate("/login", {
        replace: true,
        state: { error: decodeURIComponent(message) },
      });
    } else if (status === "success" && message) {
      console.log(decodeURIComponent(message));
      navigate("/login", {
        replace: true,
        state: { message: decodeURIComponent(message) },
      });
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [login, navigate, location]);

  return (
    <div id="main-container">
      <Routes>
        <Route
          path="/"
          element={
            <Layout id="home" playlist={playlist}>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/artists"
          element={
            <Layout id="artist" playlist={playlist}>
              <Artists />
            </Layout>
          }
        />
        <Route
          path="/artists/:id"
          element={
            <Layout id="artist" playlist={playlist}>
              <ArtistsDetailes />
            </Layout>
          }
        />
        <Route
          path="/albums"
          element={
            <Layout id="albums" playlist={playlist}>
              <Albums />
            </Layout>
          }
        />
        <Route
          path="/albums/:id"
          element={
            <Layout id="albums" playlist={playlist}>
              <AlbumsDetails />
            </Layout>
          }
        />
        <Route
          path="/playlist"
          element={
            <Layout id="playlist" playlist={playlist}>
              <Playlists />
            </Layout>
          }
        />

        <Route path="/verify" element={<Verify />} />
        <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/login" />
        <Route path="/google/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleLoginCallback />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
