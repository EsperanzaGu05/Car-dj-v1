import React from "react";
import { Link } from "react-router-dom";
// import { getArtists } from "../../utils";
import "../Content/Content.css";

const ArtistInfo = ({ artist }) => {
  return (
    <div className="card-artist">
      <Link to="/artistsDetailes" className="redirect-detailes">
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
            src={artist.images[0].url}
            width={"150px"}
            height={"150px"}
            alt={`${artist.name}`}
          />
        </div>
        <span>{artist.name}</span>
        <br></br>
        <span style={{ color: "#222222", opacity: 0.5 }}>
          {artist.genres[0]}
        </span>
      </Link>
    </div>
  );
};

export default ArtistInfo;
