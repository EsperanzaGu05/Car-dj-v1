import React from "react";
import { Link } from "react-router-dom";
import "../HomeContent/MainContent.css";

const AlbumInfo = ({ release }) => {
  return (
    <div className="card-track">
      <Link to={`/albums/${release.id}`} className="redirect-detailes">
        <div
          style={{
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={release.images[0].url}
            width={"200px"}
            height={"200px"}
            alt={`${release.name}`}
          />
        </div>
        <div style={{ height: "25px", overflow: "hidden" }}>
          <span>{release.name}</span>
        </div>
        <span style={{ color: "#222222", opacity: 0.5 }}>
          {release.artists[0].name}
        </span>
      </Link>
    </div>
  );
};

export default AlbumInfo;
