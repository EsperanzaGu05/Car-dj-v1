import React from "react";
import "../Content/Content.css";

const PlaylistInfo = ({ playlist }) => {
  return (
    <div className="card-playlist">
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={playlist.images[0].url}
          width={"150px"}
          height={"150px"}
          alt={`${playlist.name}`}
        />
      </div>
      <span>{playlist.name}</span>
      <span style={{ color: "#222222", opacity: 0.5 }}>
        {playlist.tracks.total} songs
      </span>
    </div>
  );
};

export default PlaylistInfo;
