import React from "react";
import "../HomeContent/MainContent.css";

const ArtistInfo = ({ artist }) => {
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
          src={artist.images[0]?.url}
          width={"200px"}
          height={"200px"}
          alt={artist.name}
        />
      </div>
      <span>{artist.name}</span>
      <span style={{ color: "#222222", opacity: 0.5 }}>
        Artist
      </span>
    </div>
  );
};

export default ArtistInfo;