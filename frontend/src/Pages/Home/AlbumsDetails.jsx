import React, { useEffect, useState } from "react";
import { getAlbums } from "../../utils/utils";
import { useParams } from "react-router-dom";
import { millisToMinutesAndSeconds } from "../../utils/functions";

const AlbumsDetails = () => {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchAlbumDetails = async () => {
    try {
      const fetchedAlbum = await getAlbums(id);

      setAlbumDetails(fetchedAlbum);

      console.log(fetchedAlbum);
    } catch (error) {
      setError("Error fetching album details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAlbumDetails();
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

  const album = albumDetails.albums;

  return (
    <div>
      <div className="albumSongsList">
        {album ? (
          <div>
            <h2>{album[0].name}</h2>
            <ol>
              {album[0].tracks.items.map((album, index) => (
                <li key={album.id} className="albumSongsItems">
                  <span>{index + 1}. </span>
                  <span>{album.name}</span>
                  <span>{millisToMinutesAndSeconds(album.duration_ms)}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <span className="loader">Loading...</span>
        )}
      </div>
    </div>
  );
};

export default AlbumsDetails;
