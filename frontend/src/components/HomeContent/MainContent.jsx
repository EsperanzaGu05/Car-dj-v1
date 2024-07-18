import React, { useState } from "react";
import "../HomeContent/MainContent.css";
import TrackInfo from "./TrackInfo";
import AlbumInfo from "./AlbumInfo";
import PlayerApp from "./Player";

const MainContent = ({ trackReleases, albumReleases }) => {
  // const [currentPlaylist, setCurrentPlaylist] = useState([]);

  const updatePlaylist = (track) => {
    console.log("Updating playlist with track:", track);
    setCurrentPlaylist([
      {
        name: track.name,
        src: track.preview_url, // Make sure this matches the actual property name in your data
      },
    ]);
  };

  console.log("Rendering MainContent");
  console.log("trackReleases:", trackReleases);
  console.log("albumReleases:", albumReleases);

  return (
    <div className="content-home">
      <h2>New Songs</h2>
      <div className="content-tracks">
        {(trackReleases && trackReleases.length) > 0 ? (
          <div className="all-tracks">
            {trackReleases.map((release) => (
              <TrackInfo
                key={release.id}
                release={release}
                onPlay={() => updatePlaylist(release)}
              />
            ))}
          </div>
        ) : (
          <p>No tracks available</p>
        )}
      </div>
      <div>
        <h2>New Albums</h2>
        <div className="content-tracks">
          {(albumReleases && albumReleases.length) > 0 ? (
            <div className="all-albums">
              {albumReleases.map((release) => (
                <AlbumInfo key={release.id} release={release} />
              ))}
            </div>
          ) : (
            <p>No albums available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
