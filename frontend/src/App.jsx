import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Outlet
} from "react-router-dom";
import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider, AuthContext } from "./components/contexts/AuthContext";
import "./components/LoginSection/Login.css";
import GoogleLoginCallback from "./components/LoginSection/GoogleLoginCallback";
import Home from "./Pages/Home/Home.jsx";
import Artists from "./Pages/Home/Artists.jsx";
import Albums from "./Pages/Home/Albums.jsx";
import Playlists from "./Pages/Home/Playlists.jsx";
import SearchResult from "./components/SearchBar/SearchResults.jsx";
import ArtistsDetailes from "./Pages/Home/ArtistsDetailes.jsx";

const playlist = [
  { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name: "song 1" },
  { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name: "song 2" },
  { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', name: "song 3" },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

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
      navigate("/login", { replace: true });
    } else if (status === "success" && urlMessage) {
      console.log(decodeURIComponent(urlMessage));
      setMessage(decodeURIComponent(urlMessage));
      navigate("/", { replace: true });
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [login, navigate, location]);

  return (
    <div id="main-container">
      <AsideBar />
      <div className="main-content-area">
        <SearchBar onSearch={handleSearch} />
        
        <Outlet context={{setMessage }} />
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistsDetailes />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/playlist" element={<Playlists />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/login" />
      </Route>
      <Route path="/verify" element={<Verify />} />
      <Route path="/api/register/pending/:id/:secret" element={<Verify />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/google/login" />
      <Route path="/google/callback" element={<GoogleLoginCallback />} />
    </Routes>
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