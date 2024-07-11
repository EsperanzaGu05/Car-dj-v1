import React from "react";
import "../HomeContent/MainContent.css";

const TrackInfo = ({ release }) => {
  if (!release) {
    return <div>No release information available</div>;
  }

  // Determine if it's a track or an album/playlist
  const isTrack = release.type === 'track';
  
  const imageUrl = isTrack 
    ? release.album?.images[0]?.url 
    : release.images?.[0]?.url;
  
  const name = release.name || 'Unknown';
  const artistName = isTrack 
    ? release.artists?.[0]?.name 
    : release.artists?.[0]?.name || 'Unknown Artist';

  return (
    <div className="card-track">
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            width={"200px"}
            height={"200px"}
            alt={`${name}`}
          />
        )}
      </div>
      <span>{name}</span>
      <span style={{ color: "#222222", opacity: 0.5 }}>
        {artistName}
      </span>
    </div>
  );
};

export default TrackInfo;