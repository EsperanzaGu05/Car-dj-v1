import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AccountSidebar from "./AccountSideBar";
import "../AsideBar/AsideBar.css";

const LoggedInAsideBar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAccountSidebarOpen, setAccountSidebarOpen] = useState(false);

  if (!auth) {
    return null; // or display a loading state
  }

  const handleAccountClick = () => {
    setAccountSidebarOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // Navigate to the desired route after logout
  };

  return (
    <div className="login-section-user">
      <span className="span-text">Welcome Back, {auth?.name || "User"}</span>
      <br />
      <section className="info-login">
        Manage your account and explore new features.
      </section>
      <section className="login-section-button">
        <button onClick={handleLogout} className="login-button">
          Logout
        </button>
        <button onClick={handleAccountClick} className="login-button">
          Account
        </button>
      </section>
      {isAccountSidebarOpen && (
        <AccountSidebar onClose={() => setAccountSidebarOpen(false)} />
      )}
    </div>
  );
};

export default LoggedInAsideBar;
