import React from "react";
import "../HomeContent/MainContent.css";
import TrackInfo from "./TrackInfo";

const MainContent = ({ trackReleases, albumReleases }) => {
  return (
    <div>
      <h2>New Releases</h2>
      <div>
        {(trackReleases && trackReleases.length) > 0 ? (
          <div id="all-tracks">
            {trackReleases.map((release) => (
              <TrackInfo key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
        <button class="right" onclick="rightScroll()">
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  );
};

export default MainContent;
