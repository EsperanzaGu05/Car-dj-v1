import React, { useState } from "react";
import Button from "../Button/Button";
import SignupForm from "./Signup";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import "../LoginSection/Login.css";

const Login = () => {
  const [isSignupFormVisible, setSignupFormVisible] = useState(false);
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const handleSignupClick = () => {
    setSignupFormVisible(true);
    setLoginFormVisible(false);
  };

  const handleCloseSignupForm = () => {
    setSignupFormVisible(false);
  };

  const handleLoginClick = () => {
    setLoginFormVisible(true);
    setForgotPasswordVisible(false);
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordVisible(true);
    setLoginFormVisible(false);
  };

  const handleCloseForm = () => {
    setLoginFormVisible(false);
    setForgotPasswordVisible(false);
  };

  return (
    <div id="login-section">
      <span style={{ fontWeight: 500, color: "#222222" }}>Hi Sign Up Now </span>
      <br />
      <section id="info-login">
        Follow your favorite artists and create unlimited playlists.
      </section>
      <section id="login-section-button">
        <Button onClick={handleSignupClick} message="Sign Up"/>
        {isSignupFormVisible && (
          <SignupForm
            onClose={handleCloseSignupForm}
          />
        )}
        <Button onClick={handleLoginClick} message="Login" />
        {isLoginFormVisible && (
          <LoginForm
            onClose={handleCloseForm}
            onForgotPassword={handleForgotPasswordClick}
            onSignup={handleSignupClick}
          />
        )}
        {isForgotPasswordVisible && (
          <ForgotPassword onClose={handleCloseForm} />
        )}
      </section>
    </div>
  );
};

export default Login;
