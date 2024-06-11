import React from "react";
import Icon from "../Images/Icon";
import "../AsideBar/AsideBar.css";
import Login from "../LoginSection/Login";
import FeatureButton from "../Button/FeatureButton";

const AsideBar = () => {
  return (
    <aside>
      <h1 id="logo-side">
        <Icon src="./src/assets/icon.png" width="30px" height="30px" />
        Car DJ
      </h1>
      <Login />
      <div id="features">
        <FeatureButton src="./src/assets/note.png" featureName="Albums" />
        <FeatureButton
          src="./src/assets/microphone.png"
          featureName="Artists"
        />
        <FeatureButton src="./src/assets/list.png" featureName="Playlists" />
      </div>
    </aside>
  );
};

export default AsideBar;
