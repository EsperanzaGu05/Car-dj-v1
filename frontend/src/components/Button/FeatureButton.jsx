import React from "react";
import Icon from "../Images/Icon";
import "../Button/FeatureButton.css";

const FeatureButton = (props) => {
  return (
    <button className="feature-button">
      <Icon id="logo" src={props.src} width="20px" height="20px" />
      {props.featureName}
    </button>
  );
};

export default FeatureButton;
