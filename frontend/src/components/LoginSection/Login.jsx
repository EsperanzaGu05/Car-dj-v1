import React, { useContext, useState } from "react";
import Button from "../Button/Button";
import SignupForm from "./Signup";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import { AuthContext } from '../contexts/AuthContext';
import "../LoginSection/Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isSignupFormVisible, setSignupFormVisible] = useState(false);
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [error, setError] = useState('');

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

  const handleLoginSubmit = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
        handleCloseForm();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div id="login-section">
      <span style={{ fontWeight: 500, color: "#222222" }}>Hi Sign Up Now </span>
      <br />
      <section id="info-login">
        Follow your favorite artists and create unlimited playlists.
      </section>
      <section id="login-section-button">
        <Button onClick={handleSignupClick} message="Sign Up" />
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
            onSubmit={handleLoginSubmit}
          />
        )}
        {isForgotPasswordVisible && (
          <ForgotPassword onClose={handleCloseForm} />
        )}
      </section>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
