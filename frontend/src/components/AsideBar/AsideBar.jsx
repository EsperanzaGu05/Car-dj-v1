import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoggedInAsideBar from "./AsidebarLoggedIn";
import Login from "../LoginSection/Login";
import FeatureButton from "../Button/FeatureButton";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../AsideBar/AsideBar.css";
import iconSrc from "../../assets/icon.png";
import noteSrc from "../../assets/note.png";
import microphoneSrc from "../../assets/microphone.png";
import listSrc from "../../assets/list.png";

const AsideBar = ({ fetchArtist, fetchAlbum, className, id }) => {
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
    <aside className={className}>
      <h1 className="logo-side">
        <Link to="/" className="logo-side__link" title="Home">
          <img src={iconSrc} alt="Icon" width="30px" height="30px" />
          <span className="logo-side__label">Car DJ</span>
        </Link>
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
        <section>
          <Login />
        </section>
      )}
      <div className="features">
        <FeatureButton
          className={id === "artist" ? "feature-active" : ""}
          src={microphoneSrc}
          name="Artists"
          to="/artists"
        />
        <FeatureButton
          className={id === "albums" ? "feature-active" : ""}
          src={noteSrc}
          name="Albums"
          to="/albums"
        />
        <FeatureButton
          className={id === "playlist" ? "feature-active" : ""}
          src={listSrc}
          name="Playlists"
          to="/playlist"
        />
      </div>
      <footer
        style={{
          height: "150px",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "flex-start",
        }}
      >
        Copyright 2024 Car DJ
      </footer>
      <div className="contact-us">
        <ul>
          <li>
            <a
              href="tel:+1437-CAR-DJ"
              className="contact-item"
              title="Give us a call"
            >
              <FaPhoneAlt className="icon" />
            </a>
          </li>
          <li>
            <a
              href="https://www.google.ca/maps/place/Lambton+College/@43.6274247,-79.6771064,16z/data=!3m1!4b1!4m6!3m5!1s0x882b409fb8a947f9:0x418640e93fdafd13!8m2!3d43.6274208!4d-79.6745315!16s%2Fg%2F11c1ldpfm2?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
              title="Office Address"
            >
              <FaMapMarkerAlt className="icon" />
            </a>
          </li>
          <li>
            <a
              href="mailto:CarDJ@queenscollege.ca"
              className="contact-item"
              title="Mail us"
            >
              <FaEnvelope className="icon" />
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AsideBar;
