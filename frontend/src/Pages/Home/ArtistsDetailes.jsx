import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtists, getArtistsAlbums } from "../../utils/utils";
import "../../components/Content/ArtistDetails.css";
import ArtistInfoDetailes from "../../components/ArtistDetails/ArtistInfoDetails";
import AlbumInfo from "../../components/Content/AlbumInfo";

const ArtistsDetailes = () => {
  const { id } = useParams();
  const [artistDetails, setArtistDetails] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistDetails = async () => {
    try {
      const fetchedArtistDetails = await getArtists(id);
      const fetchedArtistAlbums = await getArtistsAlbums(id);
      setArtistDetails(fetchedArtistDetails);
      setArtistAlbums(fetchedArtistAlbums);
      console.log(fetchedArtistDetails);
      console.log(fetchedArtistAlbums.items);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const artist = artistDetails.artists[0];
  const albumsArtist = artistAlbums.items;

  return (
    <div>
      <ArtistInfoDetailes artist={artist} />
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
