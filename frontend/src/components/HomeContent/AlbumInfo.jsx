import React from "react";
// import { getArtists } from "../../utils";
import "../HomeContent/MainContent.css";

const AlbumInfo = ({ release }) => {
  return (
    <div className="card-track">
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
<<<<<<< HEAD
      <span style={{ overflow: "hidden" }}>{release.name}</span>
=======
      <span>{release.name}</span>
>>>>>>> eb1faec4dd693945ae90e52e9113b102c38926b9
      <span style={{ color: "#222222", opacity: 0.5 }}>
        {release.artists[0].name}
      </span>
    </div>
  );
};

export default AlbumInfo;
