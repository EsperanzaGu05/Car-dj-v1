import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Popup from "./Popups";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reset-password/${token}`);
        const data = await response.json();
        if (response.ok) {
          setEmail(data.email);
        } else {
          setMessage(data.message || "Failed to get email.");
          setShowPopup(true);
        }
      } catch (error) {
        setMessage("An error occurred while fetching email.");
        setShowPopup(true);
      }
    };
    fetchEmail();
  }, [token]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setMessage("Passwords do not match.");
      setShowPopup(true);
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/");
        }, 3000);
      } else {
        setMessage(data.message || "Failed to update password.");
        setShowPopup(true);
      }
    } catch (error) {
      setMessage("An error occurred while updating the password.");
      setShowPopup(true);
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>Car DJ </h2>
        <h2>Reset Password</h2>
        <label>
          Email
          <input
            type="email"
            value={email}
            readOnly
          />
        </label>
        <label>
          New Password
          <div className="password-input-container">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>
        </label>
        <label>
          Confirm Password
          <div className="password-input-container">
            <input
              type={showRePassword ? "text" : "password"}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>
        <input type="submit" value="Update Password" />
      </form>
      {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ResetPassword;