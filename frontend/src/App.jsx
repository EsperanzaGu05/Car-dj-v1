import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Verify from "./components/LoginSection/verify";
import ResetPassword from "./components/LoginSection/Resetpassword";
import Login from "./components/LoginSection/Login";
import { AuthContext } from "./components/contexts/AuthContext";

function App() {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.token) {
      console.log("App Component - Token:", auth.token);
      console.log("App Component - Name:", auth.name);
      console.log("App Component - Email:", auth.email);
    }
  }, [auth]);

  return (
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
  );
}

export default App;
