import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthProvider } from "./components/contexts/AuthContext";



function App() {
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
  );
}

export default App;