import React from "react";
import "../Content/Content.css";
import PlaylistInfo from "./PlaylistInfo";

const ContentPlaylists = ({ playlists }) => {
  return (
    <div>
      <h2>Top Playlists</h2>
      <div className="content">
        {playlists ? (
          <div id="all-playlists">
            {playlists.map((playlist) => (
              <PlaylistInfo key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <span className="loader">Loading...</span>
        )}
      </div>
    </div>
  );
};

export default ContentPlaylists;
