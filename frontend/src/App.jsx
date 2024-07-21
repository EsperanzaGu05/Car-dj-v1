import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './components/Player/playlistSlice';
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
import SearchResult from "./components/SearchBar/SearchResults.jsx";
import PlaylistDetailes from "./Pages/Home/PlaylistDetailes.jsx";
import { PlaylistProvider } from "./components/contexts/PlaylistContext";
import SubscriptionSuccess from "./components/SubscriptionSuccess.jsx";
import PaymentSuccess from "./components/AsideBar/PaymentSuccess.jsx";
import { SubscriptionProvider } from "./components/contexts/SubscriptionContext";

// Create Redux store
const store = configureStore({
  reducer: {
    playlist: playlistReducer,
  },
});

function AppContent() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get("status");
    const token = urlParams.get("token");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const urlMessage = urlParams.get("message");

    if (status === "success" && token && name && email) {
      login(token, name, email);
      setMessage("Login successful!");
      navigate("/", { replace: true });
    } else if (status === "error" && urlMessage) {
      console.error(decodeURIComponent(urlMessage));
      setMessage(decodeURIComponent(urlMessage));
      navigate("/", { replace: true });
    } else if (status === "success" && urlMessage) {
      console.log(decodeURIComponent(urlMessage));
      setMessage(decodeURIComponent(urlMessage));
      navigate("/", { replace: true });
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [login, navigate, location]);

  return (
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
          path="/artists/:id"
          element={
            <Layout id="artist">
              <ArtistsDetailes />
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
          path="/albums/:id"
          element={
            <Layout id="albums">
              <AlbumsDetails />
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
        <Route
          path="/playlist/:id"
          element={
            <Layout id="playlist">
              <PlaylistDetailes />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchResult />
            </Layout>
          }
        />
        <Route path="/verify" element={<Verify />} />
        <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/google/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleLoginCallback />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SubscriptionProvider>
          <PlaylistProvider>
            <Router>
              <AppContent />
            </Router>
          </PlaylistProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;