import React from "react";
// import { getArtists } from "../../utils";
import "../Content/Content.css";

const AlbumInfo = ({ album }) => {
  return (
    <div className="card-album">
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={album.images[0].url}
          width={"180px"}
          height={"180px"}
          alt={`${album.name}`}
        />
      </div>
      <span>{album.name}</span>
      <span style={{ color: "#222222", opacity: 0.5 }}>
        {album.artists[0].name}
      </span>
    </div>
  );
};

export default AlbumInfo;
