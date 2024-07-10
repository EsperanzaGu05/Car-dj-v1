import React from "react";
import Icon from "../Images/Icon";
import { Link } from "react-router-dom";

import "../Button/FeatureButton.css";

const FeatureButton = ({ to, src, name, className }) => (
  <Link className={`feature-button ${className}`} to={to}>
    <Icon id="logo" src={src} width="20px" height="20px" />
    <span>{name}</span>
  </Link>
);

export default FeatureButton;
