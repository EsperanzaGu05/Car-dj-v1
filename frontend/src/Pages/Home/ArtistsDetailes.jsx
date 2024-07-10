import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getArtists,
  getArtistAlbums,
  getArtistTopTracks,
} from "../../utils/utils";
import "../../components/Content/ArtistDetails.css";
import "../../components/Content/Content.css";
import ArtistInfoDetailes from "../../components/ArtistDetails/ArtistInfoDetails";
import AlbumInfo from "../../components/Content/AlbumInfo";
import { millisToMinutesAndSeconds } from "../../utils/functions";

const ArtistsDetailes = () => {
  const { id } = useParams();
  const [artistDetails, setArtistDetails] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState(null);
  const [artistTopTracks, setArtistTopTracks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistDetails = async () => {
    try {
      const fetchedArtistDetails = await getArtists(id);
      const fetchedArtistAlbums = await getArtistAlbums(id);
      const fetchedArtistTopTracks = await getArtistTopTracks(id);
      setArtistDetails(fetchedArtistDetails);
      setArtistAlbums(fetchedArtistAlbums);
      setArtistTopTracks(fetchedArtistTopTracks);
      console.log(fetchedArtistDetails);
      console.log(fetchedArtistAlbums.items);
      console.log(fetchedArtistTopTracks);
    } catch (error) {
      setError("Error fetching artist details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArtistDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ top: "10%", left: "10%" }} className="loader">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const artist = artistDetails.artists[0];
  const albumsArtist = artistAlbums.items;
  const topTracksArtist = artistTopTracks.tracks;

  return (
    <div>
      <ArtistInfoDetailes artist={artist} />
      <h2>Top Tracks</h2>
      <div className="artistTopTrackList">
        {topTracksArtist ? (
          <ol>
            {topTracksArtist.map((topTrack, index) => (
              <li key={topTrack.id} className="artistTopTrackItems">
                <span>{index + 1}. </span>
                <img
                  src={topTrack.album.images[0].url}
                  width={"40px"}
                  height={"40px"}
                  alt={`${topTrack.name}`}
                ></img>
                <span>{topTrack.name} </span>
                <span>{topTrack.artists[0].name}</span>
                <span>{millisToMinutesAndSeconds(topTrack.duration_ms)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <span className="loader">Loading...</span>
        )}
      </div>
      <h2>Albums</h2>
      <div className="content-albums">
        {albumsArtist ? (
          <div className="all-albums">
            {albumsArtist.map((album) => (
              <AlbumInfo key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <span className="loader">Loading...</span>
        )}
      </div>
    </div>
  );
};

export default ArtistsDetailes;
