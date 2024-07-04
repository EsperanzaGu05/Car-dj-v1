import React from "react";
import "../HomeContent/MainContent.css";
import TrackInfo from "./TrackInfo";
import AlbumInfo from "./AlbumInfo";

const MainContent = ({ trackReleases, albumReleases }) => {
  return (
    <div className="content-home">
      <h2>New Songs</h2>
      <div className="content-tracks">
        {(trackReleases && trackReleases.length) > 0 ? (
          <div id="all-tracks">
            {trackReleases.map((release) => (
              <TrackInfo key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
      <div>
        <h2>New Albums</h2>
        <div className="content-tracks">
          {(albumReleases && albumReleases.length) > 0 ? (
            <div id="all-tracks">
              {albumReleases.map((release) => (
                <AlbumInfo key={release.id} release={release} />
              ))}
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MainContent;
=======
export default MainContent;
>>>>>>> eb1faec4dd693945ae90e52e9113b102c38926b9
