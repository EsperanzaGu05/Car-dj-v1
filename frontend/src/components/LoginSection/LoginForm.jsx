import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import "./LoginForm.css";

const LoginForm = ({ onClose, onForgotPassword, onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const userId = urlParams.get('userId');

    console.log('URL Params:', { token, name, email, userId }); // Debug URL params

    if (token && name && email && userId) {
      console.log('Logging in with:', { token, name, email, userId });
      login(token, name, email, userId);
      onClose();
      navigate('/'); // or your preferred route after login
    }
  }, [login, onClose, navigate, location]);

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

      console.log('Server response:', data);

      if (response.ok) {
        console.log('Received login data:', { token: data.token, name: data.name, email: data.email, userId: data.userId });
        if (data.token && data.name && data.email && data.userId) {
          login(data.token, data.name, data.email, data.userId);
          onClose();
          navigate('/'); // or your preferred route after login
        } else {
          setError("Invalid server response");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google/login";
  };

  return (
    <div id="login-form-whole">
      <div id="login-form">
        <span className="close" onClick={onClose}>&times;</span>
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
                  src={showPassword ? "./src/assets/hide.png" : "./src/assets/view.png"}
                  width="18px"
                  height="18px"
                  alt="Show/Hide password"
                />
              </button>
            </div>
          </label>
          <a onClick={onForgotPassword} className="forgot-password-link">
            Forgot Password
          </a>

          {error && <p className="error-message">{error}</p>}

          <input type="submit" value="LOGIN" className="login-form-btn" />
          <p style={{
            color: "black",
            fontSize: "12px",
            display: "flex",
            justifyContent: "center",
          }}>
            <span style={{ marginRight: "8px" }}>Not a member?</span>
            <a onClick={onSignup}> Sign up now</a>
          </p>
          <span style={{
            color: "black",
            fontSize: "14px",
            display: "flex",
            justifyContent: "center",
            fontWeight: 700,
          }}>
            OR
          </span>
          <button 
            id="form-google-button" 
            onClick={handleGoogleSignIn} 
            type="button"
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
              <span>Sign in</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
