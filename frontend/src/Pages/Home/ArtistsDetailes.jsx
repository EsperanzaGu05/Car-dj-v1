import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getArtists,
  getArtistAlbums,
  getArtistTopTracks,
  getArtistRelated,
} from "../../utils/utils";
import "../../components/Content/ArtistDetails.css";
import "../../components/Content/Content.css";
import ArtistInfoDetailes from "../../components/ArtistDetails/ArtistInfoDetails";
import AlbumInfo from "../../components/Content/AlbumInfo";
import { millisToMinutesAndSeconds } from "../../utils/functions";
<<<<<<< Updated upstream
import ArtistInfo from "../../components/Content/ArtistInfo";
=======
import ArtistInfo from "../../components/HomeContent/ArtistInfo";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AuthContext } from "../../components/contexts/AuthContext";
import { useDispatch } from "react-redux";
import { setCurrentPlaylist, setCurrentTrack } from "../../components/Player/playlistSlice";
import playButtonSrc from "../../assets/play-button.svg";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
>>>>>>> Stashed changes

const ArtistsDetailes = () => {
  const { id } = useParams();
  const [artistDetails, setArtistDetails] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState(null);
  const [artistRelated, setArtistRelated] = useState(null);
  const [artistTopTracks, setArtistTopTracks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistDetails = async () => {
    try {
      const fetchedArtistDetails = await getArtists(id);
      const fetchedArtistAlbums = await getArtistAlbums(id);
      const fetchedArtistTopTracks = await getArtistTopTracks(id);
      const fetchedArtistRelated = await getArtistRelated(id);
      setArtistDetails(fetchedArtistDetails);
      setArtistAlbums(fetchedArtistAlbums);
      setArtistTopTracks(fetchedArtistTopTracks);
      setArtistRelated(fetchedArtistRelated);
      console.log(fetchedArtistDetails);
      console.log(fetchedArtistAlbums.items);
      console.log(fetchedArtistTopTracks);
      console.log(fetchedArtistRelated);
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
  const relatedArtists = artistRelated;

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
      <h2>Related Artists</h2>
      <div className="content-related-artists">
        {relatedArtists ? (
          <div className="all-artists">
            {relatedArtists.artists.map((artist) => (
              <ArtistInfo key={artist.id} artist={artist} />
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
