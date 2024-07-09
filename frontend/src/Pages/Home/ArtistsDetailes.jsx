import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtists } from "../../utils/utils";
import "../../components/Content/ArtistDetailes.css";

const ArtistsDetailes = () => {
  const { id } = useParams();
  const [artistDetails, setArtistDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistDetails = async () => {
    try {
      const fetchedArtistDetails = await getArtists(id);
      setArtistDetails(fetchedArtistDetails);
      console.log(fetchedArtistDetails);
    } catch (error) {
      setError("Error fetching artist details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const artist = artistDetails.artists[0];

  return (
    <section className="artist-detailes-section">
      <div>
        <img
          style={{
            borderRadius: "5%",
          }}
          src={artist.images[2].url}
          width={"200px"}
          height={"200px"}
          alt={`${artist.name}`}
        />
      </div>
      <div>
        {" "}
        <span>Artist</span>
        <span>{artist.name}</span>
        <span style={{ color: "#222222", opacity: 0.5 }}>{artist.genres}</span>
      </div>
    </section>
  );
};

export default ArtistsDetailes;
