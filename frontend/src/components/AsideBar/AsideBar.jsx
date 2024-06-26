import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoggedInAsideBar from './AsidebarLoggedIn';
import Login from '../LoginSection/Login';  
import FeatureButton from '../Button/FeatureButton'; 
import "../AsideBar/AsideBar.css";

import iconSrc from "../../assets/icon.png"; 
import noteSrc from "../../assets/note.png"; 
import microphoneSrc from "../../assets/microphone.png";
import listSrc from "../../assets/list.png";

const AsideBar = () => {
  const { auth } = useContext(AuthContext);

  return (
    <aside>
      <h1 id="logo-side">
        <img src={iconSrc} alt="Icon" width="30px" height="30px" />
        Car DJ
      </h1>
      {auth ? (
        <LoggedInAsideBar />
      ) : (
        <section id="login-section-button">
          <Login />
        </section>
      )}
      <div id="features">
        <FeatureButton src={noteSrc} featureName="Albums" />
        <FeatureButton src={microphoneSrc} featureName="Artists" />
        <FeatureButton src={listSrc} featureName="Playlists" />
      </div>
    </aside>
  );
};

export default AsideBar;
