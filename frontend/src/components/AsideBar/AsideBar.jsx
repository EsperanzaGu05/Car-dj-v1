import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoggedInAsideBar from "./AsidebarLoggedIn";
import Login from "../LoginSection/Login";
import FeatureButton from "../Button/FeatureButton";
import "../AsideBar/AsideBar.css";
import iconSrc from "../../assets/icon.png";
import noteSrc from "../../assets/note.png";
import microphoneSrc from "../../assets/microphone.png";
import listSrc from "../../assets/list.png";

const AsideBar = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const msg = params.get("message");

    if (status && msg) {
      setMessage(decodeURIComponent(msg));
      setMessageType(status);
      setTimeout(() => {
        setMessage("");
        setMessageType("");
        navigate("/", { replace: true });
      }, 5000);
    }
  }, [location, navigate]);

  return (
    <aside>
      <h1 id="logo-side">
        <img src={iconSrc} alt="Icon" width="30px" height="30px" />
        Car DJ
      </h1>
      {message && (
        <div
          className={`alert ${messageType}-alert`}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: messageType === "error" ? "#f8d7da" : "#d4edda",
            color: messageType === "error" ? "#721c24" : "#155724",
            border: `1px solid ${
              messageType === "error" ? "#f5c6cb" : "#c3e6cb"
            }`,
          }}
        >
          {message}
        </div>
      )}
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
      <div>
        <footer
          style={{
            height: "230px",
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "flex-start",
          }}
        >
          {" "}
          Copyright 2024 Car DJ
        </footer>
      </div>
    </aside>
  );
};

export default AsideBar;
