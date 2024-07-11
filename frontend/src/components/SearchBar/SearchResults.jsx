import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TrackInfo from "../HomeContent/TrackInfo";
import AlbumInfo from "../HomeContent/AlbumInfo";
import ArtistInfo from "../HomeContent/ArtistInfo";
import { searchSpotify } from "../../utils/utils"; // Adjust this path as needed
import "../HomeContent/MainContent.css"; // Adjust this path as needed

const SearchResult = () => {
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    albums: [],
    artists: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await searchSpotify(searchQuery);
        console.log("Search results:", data); // For debugging
        setSearchResults({
          tracks: data.tracks?.items || [],
          albums: data.albums?.items || [],
          artists: data.artists?.items || [],
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div style={{ paddingLeft: "20px" }}>
      <h3>Search Results for: {searchQuery}</h3>
      <div className="search-content">
        <section>
          <h2>Songs</h2>
          <div className="content-tracks">
            {searchResults.tracks.length > 0 ? (
              <div className="all-tracks">
                {searchResults.tracks.map((track) => (
                  <TrackInfo key={track.id} release={track} />
                ))}
              </div>
            ) : (
              <p>No songs found</p>
            )}
          </div>
        </section>

        <section>
          <h2>Albums</h2>
          <div className="content-tracks">
            {searchResults.albums.length > 0 ? (
              <div className="all-albums">
                {searchResults.albums.map((album) => (
                  <AlbumInfo key={album.id} release={album} />
                ))}
              </div>
            ) : (
              <p>No albums found</p>
            )}
          </div>
        </section>

        <section>
          <h2>Artists</h2>
          <div className="content-tracks">
            {searchResults.artists.length > 0 ? (
              <div className="all-artists">
                {searchResults.artists.map((artist) => (
                  <ArtistInfo key={artist.id} artist={artist} />
                ))}
              </div>
            ) : (
              <p>No artists found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchResult;
