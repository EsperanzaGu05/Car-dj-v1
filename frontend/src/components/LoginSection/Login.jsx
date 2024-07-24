import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import SignupForm from "./Signup";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import { AuthContext } from "../contexts/AuthContext";
import "../LoginSection/Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isSignupFormVisible, setSignupFormVisible] = useState(false);
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    if (status === 'success') {
      handleGoogleSignInCallback();
    }
  }, [location]);

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
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.name, data.email, data.userId);
        handleCloseForm();
        navigate('/'); // or wherever you want to redirect after login
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google/login";
  };

  const handleGoogleSignInCallback = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const userId = urlParams.get('userId');

    if (token && name && email && userId) {
      login(token, name, email, userId);
      navigate('/'); // or wherever you want to redirect after login
    } 
  };

  return (
    <div className="login-section">
      <span className="login-section-text">Hi Sign Up Now </span>
      <section className="info-login">
        Follow your favorite artists and create unlimited playlists.
      </section>
      <section className="login-section-button">
        <Button onClick={handleSignupClick} message="Sign Up" />
        {isSignupFormVisible && <SignupForm onClose={handleCloseSignupForm} />}
        <Button onClick={handleLoginClick} message="Login" />
        {isLoginFormVisible && (
          <LoginForm
            onClose={handleCloseForm}
            onForgotPassword={handleForgotPasswordClick}
            onSignup={handleSignupClick}
            onSubmit={handleLoginSubmit}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}
        {isForgotPasswordVisible && (
          <ForgotPassword onClose={handleCloseForm} />
        )}
      </section>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;