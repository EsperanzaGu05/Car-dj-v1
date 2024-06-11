import React from "react";
import Button from "../Button/Button";
import "../LoginSection/Login.css";
const Login = () => {
  return (
    <div id="login-section">
      <span style={{ fontWeight: 500, color: "#222222" }}>Hi Sign Up Now </span>
      <br />
      <section id="info-login">
        Follow your favorite artists and create unlimited playlists.
      </section>
      <section id="login-section-button">
        <Button message="Sign Up" />
        <Button message="Login" />
      </section>
    </div>
  );
};

export default Login;
