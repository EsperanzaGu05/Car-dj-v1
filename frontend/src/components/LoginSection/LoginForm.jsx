import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import "./LoginForm.css";

const LoginForm = ({ onClose, onForgotPassword, onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Log the response data to the console
      console.log('Server response:', data);

      if (response.ok) {
        // Handle successful login, e.g., save the token and update auth state
        if (data.token && data.name && data.email) {
          login(data.token, data.name, data.email);
          onClose(); // Close the login form
        } else {
          setError("Invalid server response");
        }
      } else {
        // Set the error message from the response
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div id="login-form-whole">
      <div id="login-form">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3 id="login-title">Login</h3>
        <form onSubmit={handleSubmit}>
          <label className="login-form-label">
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-box"
              required
            />
          </label>

          <label className="login-form-label">
            Password
            <div id="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="login-form-box"
                style={{
                  width: "330px",
                  padding: "0px",
                  margin: "0px",
                  border: "none",
                }}
                required
              />
              <button
                type="button"
                id="show-password"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <img
                  src={
                    showPassword
                      ? "./src/assets/hide.png"
                      : "./src/assets/view.png"
                  }
                  width="18px"
                  height="18px"
                />
              </button>
            </div>
          </label>
          <a onClick={onForgotPassword} className="forgot-password-link">
            Forgot Password
          </a>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <input type="submit" value="LOGIN" className="login-form-btn" />
          <p
            style={{
              color: "black",
              fontSize: "12px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span style={{ marginRight: "8px" }}>Not a member?</span>
            <a onClick={onSignup}> Sign up now</a>
          </p>
          <span
            style={{
              color: "black",
              fontSize: "14px",
              display: "flex",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            OR
          </span>
          <button id="form-google-button">
            Sign in with
            <img
              src="./src/assets/icongoogle.png"
              width="30px"
              height="30px"
              style={{ paddingLeft: "10px" }}
            ></img>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
