import React from "react";
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
      <span
        style={{ height: "25px", overflow: "hidden" }}
        className="albumName-albumCard"
      >
        {album.name}
      </span>
      <span style={{ height: "25px", overflow: "hidden" }}>
        {album.artists[0].name}
      </span>
    </div>
  );
};

export default AlbumInfo;
