import React from "react";
import "../Content/Content.css";
import ArtistInfo from "./ArtistInfo";

const ContentArtists = ({ artists }) => {
  return (
    <div>
      <h2>Top Artists</h2>
      <div className="content">
        {artists ? (
          <div id="all-artists">
            {artists.artists.map((artist) => (
              <ArtistInfo key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <span className="loader">Loading...</span>
        )}
      </div>
    </div>
  );
};

export default ContentArtists;
