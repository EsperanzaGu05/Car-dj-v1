import React from "react";

const SearchResults = ({ searchResults }) => {
  return (
    <div>
      {searchResults ? (
        <div>
          <h2>Search Results</h2>
          {searchResults.tracks && (
            <div>
              <h3>Tracks</h3>
              <ul>
                {searchResults.tracks.items.map((track) => (
                  <li key={track.id}>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</li>
                ))}
              </ul>
            </div>
          )}
          {searchResults.artists && (
            <div>
              <h3>Artists</h3>
              <ul>
                {searchResults.artists.items.map((artist) => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ul>
            </div>
          )}
          {searchResults.albums && (
            <div>
              <h3>Albums</h3>
              <ul>
                {searchResults.albums.items.map((album) => (
                  <li key={album.id}>{album.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
