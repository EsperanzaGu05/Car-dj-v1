import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './components/LoginSection/Login.css';
import AsideBar from './components/AsideBar/AsideBar';
import SearchBar from './components/SearchBar/SearchBar';
import Verify from './components/LoginSection/verify';
import ForgotPassword from './components/LoginSection/ForgotPassword';
import ResetPassword from './components/LoginSection/Resetpassword';

function App() {
  return (
    <Router>
      <div id="main-container">
        <AsideBar />
        <SearchBar />
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
