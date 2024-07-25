import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import "./LoginForm.css";

const SignupForm = ({ onClose, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwerror, setPwerror] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
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
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.includes(' ')) {
      setPwerror("Don't put spaces between, before, or after the password.");
      return;
    }

    const passwordRegex = new RegExp(
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).{8,}$"
    );
    if (!passwordRegex.test(newPassword)) {
      setPwerror(
        "Password should have letter, capital letter, digit and special character and minimum 8 in length."
      );
    } else {
      setPwerror("");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (newName.trim() === "") {
      setNameError("Name cannot be empty or consist only of spaces");
    } else {
      setNameError("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (name.trim() === "") {
      setNameError("Name cannot be empty or consist only of spaces");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (pwerror) {
      setErrorMessage("Please correct the password errors before submitting.");
      setIsLoading(false);
      return;
    }

    const data = {
      name: name.trim(),
      email,
      password,
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
              onChange={handleNameChange}
              className="login-form-box"
              required
            />
            {nameError && <span className="error-message" style={{ color: "red" }}>{nameError}</span>}
          </label>
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
            Password{" "}
            <div id="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
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
            disabled={isLoading || name.trim() === "" || pwerror !== ""}
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
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              color: 'black',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FcGoogle size={24} />
              <span>{isLoading ? "Processing..." : "Sign up"}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;