import React from "react";

const LoginForm = () => {
  return (
    <div id="login-form">
      <form>
        <h3 id="login-title">Login</h3>
        <label className="login-form-label">Email</label>
        <br></br>
        <input
          type="email"
          name="username"
          className="login-form-box"
          required
        />
        <br></br>
        <label className="login-form-label">Password</label>
        <br></br>
        <input type="password" name="password" className="login-form-box" />
        <br></br>
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
  );
};

export default LoginForm;
