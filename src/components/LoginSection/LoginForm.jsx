import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div id="login-form-whole">
      <div id="login-form">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3 id="login-title">Login</h3>
        <form>
          <label className="login-form-label">
            Email
            <input
              type="email"
              name="email"
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
          <a className="forgot-password-link">Forgot Password? </a>
          <br></br>
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
            <a> Sign up now</a>
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
