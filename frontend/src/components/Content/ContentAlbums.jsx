import React from "react";
import "../Content/Content.css";
import AlbumInfo from "./AlbumInfo";

const ContentAlbums = ({ albums }) => {
  return (
    <div>
      <h2>Top Albums</h2>
      <div id="content">
        {albums ? (
          <div id="all-albums">
            {albums.albums.map((album) => (
              <AlbumInfo key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <p>No artist information available</p>
        )}
      </div>
    </div>
  );
};

export default ContentAlbums;
