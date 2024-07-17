import React from "react";
import { Link } from "react-router-dom";
import "../Content/Content.css";

const PlaylistInfo = ({ playlist }) => {
  return (
    <div className="card-playlist">
      <Link to={`/playlist/${playlist.id}`} className="redirect-detailes">
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
        <div
          style={{ height: "50px", display: "flex", flexDirection: "column" }}
        >
          <span>{playlist.name}</span>
          <span style={{ color: "#222222", opacity: 0.5 }}>
            {playlist.tracks.total} songs
          </span>
        </div>
      </Link>
    </div>
  );
};

export default PlaylistInfo;
