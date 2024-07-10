import React from "react";
import "../../components/Content/ArtistDetails.css";

const ArtistInfoDetails = (artist) => {
  return (
    <section className="artist-detailes">
      <div className="thumbnail">
        <img
          style={{
            borderRadius: "5%",
          }}
          src={artist.artist.images[2].url}
          width={"200px"}
          height={"200px"}
          alt={`${artist.artist.name}`}
        />
      </div>
      <div className="artist-detailes-info">
        <span style={{ fontWeight: "600" }}>Artist</span>
        <span
          style={{ fontWeight: "600", color: "#3552c5", fontSize: "x-large" }}
        >
          {artist.artist.name}
        </span>
        <span style={{ color: "#222222", opacity: 0.5 }}>
          {artist.artist.genres}
        </span>
      </div>
    </section>
  );
};

export default ArtistInfoDetails;
