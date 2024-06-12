import React from "react";
import "./Button.css";

const Button = ({ onClick, message }) => {
  return (
    <button onClick={onClick} className="login-button">
      {message}
    </button>
  );
};

export default Button;
