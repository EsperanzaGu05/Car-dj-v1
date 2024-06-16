import React, { useState } from "react";
import "./LoginForm.css";

const SignupForm = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwerror, setPwerror] = useState("");
  const handlePasswordChange = (e) => {
    setPassword(e);
    const passwordRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s0-9]).{8,}$");
    if(!passwordRegex.test(e)){
      setPwerror("Password should have letter, capital letter, digit and special character and minimum 8 in length")
    }else{
      setPwerror("");
    }
  }

  return (
    <div id="login-form-whole">
      <div id="signup-form">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3 id="login-title">Register</h3>
        <form>
          <label className="login-form-label">
            Name
            <input
              type="text"
              name="name"
              className="login-form-box"
              required
            />
          </label>
          <label className="login-form-label">
            Email
            <input
              type="email"
              name="email"
              pattern=".+@.+\.com"
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
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s]).{8,}$"
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
            {pwerror && <span class="password-error">{pwerror}</span>}
          </label>

          <br></br>
          <input type="submit" value="SIGNUP" className="form-btn" />
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
            Sign up with
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

export default SignupForm;
