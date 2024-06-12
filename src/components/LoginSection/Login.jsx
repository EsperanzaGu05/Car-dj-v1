import React, { useState } from "react";
import Button from "../Button/Button";
import LoginForm from "./LoginForm";
import "../LoginSection/Login.css";

const Login = () => {
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);

  const handleLoginClick = () => {
    setLoginFormVisible(true);
  };

  const handleCloseForm = () => {
    setLoginFormVisible(false);
  };
  return (
    <div id="login-section">
      <span style={{ fontWeight: 500, color: "#222222" }}>Hi Sign Up Now </span>
      <br />
      <section id="info-login">
        Follow your favorite artists and create unlimited playlists.
      </section>
      <section id="login-section-button">
        <Button message="Sign Up" />
        <Button onClick={handleLoginClick} message="Login" />
        {isLoginFormVisible && <LoginForm onClose={handleCloseForm} />}
      </section>
    </div>
  );
};

export default Login;
