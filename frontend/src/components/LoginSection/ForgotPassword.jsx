import React, { useState } from "react";
import Popup from "./Popups";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/forgot-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("A link to reset your password has been sent to your email address.");
      } else {
        setMessage(data.message || "Failed to send reset password email.");
      }
      setIsSubmitted(true);
      setShowPopup(true);
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      setShowPopup(true);
    }
  };

  return (
    <div id="login-forgotpassword-whole">
      <div id="forgot-password">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <br />
        <h3 id="login-title">Reset Password</h3>
        {isSubmitted ? (
          <p style={{ color: "#222222", fontSize: "14px" }}>
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: "#222222", fontSize: "14px" }}>
              If you have forgotten or need to reset your password, please enter
              your email address below. We will email you a link that you can
              use to reset your password.
            </p>
            <label className="forgot-password-label">
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
            <input type="submit" value="Submit" className="login-form-btn" />
          </form>
        )}
        {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};

export default ForgotPassword;
