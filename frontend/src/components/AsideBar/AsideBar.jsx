import React from "react";
import "../AsideBar/AsideBar.css";
import Login from "../LoginSection/Login";
import FeatureButton from "../Button/FeatureButton";

import iconSrc from "../../assets/icon.png"; // Adjust the path based on your directory structure
import noteSrc from "../../assets/note.png"; 
import microphoneSrc from "../../assets/microphone.png";
import listSrc from "../../assets/list.png";

const AsideBar = () => {
  return (
    <aside>
      <h1 id="logo-side">
        <img src={iconSrc} alt="Icon" width="30px" height="30px" />
        Car DJ
      </h1>
      <Login />
      <div id="features">
        <FeatureButton src={noteSrc} featureName="Albums" />
        <FeatureButton src={microphoneSrc} featureName="Artists" />
        <FeatureButton src={listSrc} featureName="Playlists" />
      </div>
    </aside>
  );
};

export default AsideBar;
