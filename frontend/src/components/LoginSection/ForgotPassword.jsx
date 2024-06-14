import React, { useState } from "react";
import "./LoginForm.css";

const ForgotPassword = ({ onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
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
            A link to reset your password has been sent to your email address.
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
                pattern=".+@.+\.com"
                className="login-form-box"
                required
              />
            </label>
            <input type="submit" value="Submit" className="login-form-btn" />
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
