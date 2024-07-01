import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const SignupForm = ({ onClose, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwerror, setPwerror] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    if (status === 'success') {
      setSuccessMessage(decodeURIComponent(message));
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 5000);
    } else if (status === 'error') {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [onClose]);

  const handlePasswordChange = (e) => {
    setPassword(e);
    const passwordRegex = new RegExp(
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s0-9]).{8,}$"
    );
    if (!passwordRegex.test(e)) {
      setPwerror(
        "Password should have letter, capital letter, digit and special character and minimum 8 in length"
      );
    } else {
      setPwerror("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== rePassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const data = {
      name,
      email,
      password,
      rePassword,
    };

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrorMessage("User already exists.");
        } else {
          setErrorMessage(
            errorData.message || "An error occurred during registration."
          );
        }
      } else {
        setSuccessMessage(
          "Registration successful. Please check your email to verify your account."
        );
        setErrorMessage("");
        setName("");
        setEmail("");
        setPassword("");
        setRePassword("");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    window.location.href = "http://localhost:5000/api/auth/google/signup";
  };

  return (
    <div id="login-form-whole">
      {successMessage && (
        <div className="success-alert">
          {successMessage}
        </div>
      )}
      <div id="signup-form">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3 id="login-title">Register</h3>
        <form onSubmit={handleSignup}>
          <label className="login-form-label">
            Name
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-form-box"
              required
            />
          </label>
          <label className="login-form-label">
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern=".+@.+"
              className="login-form-box"
              required
            />
          </label>
          <label className="login-form-label">
            Password{" "}
            <div id="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
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
                  src={showPassword ? "./src/assets/hide.png" : "./src/assets/view.png"}
                  width="18px"
                  height="18px"
                  alt="Toggle password visibility"
                />
              </button>
            </div>
            {pwerror && <span className="password-error">{pwerror}</span>}
          </label>
          <label className="login-form-label">
            Re-enter Password{" "}
            <input
              type="password"
              name="rePassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="login-form-box"
              required
            />
          </label>
          {errorMessage && (
            <span className="error-message" style={{ color: "red" }}>
              {errorMessage}
            </span>
          )}
          <br />
          <input 
            type="submit" 
            value={isLoading ? "PROCESSING..." : "SIGNUP"} 
            className="form-btn" 
            disabled={isLoading}
          />
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
          <button
            type="button"
            id="form-google-button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign up with Google"}
            <img
              src="./src/assets/icongoogle.png"
              width="30px"
              height="30px"
              style={{ paddingLeft: "10px" }}
              alt="Google icon"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;