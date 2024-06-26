import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Popup from "./Popups";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setMessage("Passwords do not match.");
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Update Password" />
      </form>
      {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ResetPassword;
