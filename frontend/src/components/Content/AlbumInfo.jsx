import React from "react";
import { Link } from "react-router-dom";
import "../Content/Content.css";

const AlbumInfo = ({ album }) => {
  return (
    <div className="card-album">
      <Link to={`/albums/${album.id}`} className="redirect-detailes">
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
        <div
          style={{ height: "50px", display: "flex", flexDirection: "column" }}
        >
          <span className="albumName-albumCard">{album.name}</span>
          <span style={{ color: "#222222", opacity: 0.5 }}>
            {album.artists[0].name}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default AlbumInfo;
