import React from "react";
import "../HomeContent/MainContent.css";
import { Link } from "react-router-dom";
import "../../components/Content/Content.css";
const ArtistInfo = ({ artist }) => {
  return (
    <div className="card-artist">
      <Link to={`/artists/${artist.id}`} className="redirect-detailes">
        <div
          style={{
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              borderRadius: "50%",
            }}
            src={artist.images[0]?.url}
            width={"150px"}
            height={"150px"}
            alt={artist.name}
          />
        </div>
        <span className="label-style">{artist.name}</span>
        <br></br>
        <span style={{ color: "#222222", opacity: 0.5 }}>
          {artist.genres[0]}
        </span>
      </Link>
    </div>
  );
};

export default ArtistInfo;
