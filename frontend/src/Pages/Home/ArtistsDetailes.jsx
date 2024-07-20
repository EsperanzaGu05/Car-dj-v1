import React, { useState, useEffect, useContext } from "react";
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

const ArtistsDetailes = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [artistDetails, setArtistDetails] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState(null);
  const [artistRelated, setArtistRelated] = useState(null);
  const [artistTopTracks, setArtistTopTracks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const dispatch = useDispatch();

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
      dispatch(setCurrentPlaylist(fetchedArtistTopTracks.tracks));
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
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [id, isPlaylistDialogOpen]);

  const fetchPlaylists = async () => {
    if (!auth) {
      showSnackbar("You need an account to add songs to a playlist", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/playlists", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPlaylists(data);
      } else {
        console.error("Failed to fetch playlists:", data);
        showSnackbar("Failed to fetch playlists", "error");
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      showSnackbar("Error fetching playlists", "error");
    }
  };
  console.log(artistTopTracks);
  const handleAddToPlaylist = async (playlistId) => {
    if (!auth) {
      showSnackbar("You need an account to add songs to a playlist", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/playlists/${playlistId}/songs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            songId: selectedTrack.id,
            songName: selectedTrack.name,
            artist: selectedTrack.artists[0].name,
            imageUrl: selectedTrack.album.images[0].url,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Song added to playlist successfully");
        showSnackbar("Song added to playlist successfully", "success");
      } else {
        console.error("Failed to add song to playlist:", data);
        showSnackbar(data.message || "Failed to add song to playlist", "error");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      showSnackbar("Error adding song to playlist", "error");
    }
    setPlaylistDialogOpen(false);
    setAnchorEl(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuOpen = (event, track) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrack(track);
  };
  const handleSongClick = (track) => {
    setSelectedSong(track.id === selectedSong ? null : track.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToPlaylistClick = () => {
    if (!auth) {
      showSnackbar("You need an account to add songs to a playlist", "error");
      return;
    }
    setPlaylistDialogOpen(true);
    handleMenuClose();
  };

  useEffect(() => {
    if (id) {
      fetchArtistDetails();
      handleMenuClose();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ top: "20px", left: "20px" }} className="loader">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  const updatePlaylist = (track) => {
    dispatch(setCurrentTrack(track));
  };

  const artist = artistDetails.artists[0];
  const albumsArtist = artistAlbums.items;
  const topTracksArtist = artistTopTracks.tracks;
  const relatedArtists = artistRelated;
  console.log(topTracksArtist);

  return (
    <div>
      <section className="artist-detailes">
        <div className="thumbnail">
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
        <div className="artist-detailes-info">
          <span style={{ fontWeight: "600" }}>Artist</span>
          <span
            style={{ fontWeight: "600", color: "#3552c5", fontSize: "x-large" }}
          >
            {artist.name}
          </span>
          <span style={{ color: "#222222", opacity: 0.5 }}>
            {artist.genres}
          </span>
          <div style={{ padding: "10px" }}>
            <img src={playButtonSrc} alt="" onClick={() => updatePlaylist(0)} />
          </div>
        </div>
      </section>
      <h2>Top Tracks</h2>
      <div className="artistTopTrackList">
        {topTracksArtist ? (
          <ol style={{ paddingLeft: "10px" }}>
            {topTracksArtist.map((topTrack, index) => (
              <li
                key={topTrack.id}
                className={`artistTopTrackItems ${
                  topTrack.id === selectedSong ? "selected" : ""
                }`}
                onClick={() => {
                  handleSongClick(topTrack);
                  updatePlaylist(index);
                }}
              >
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
                <span>
                  <IconButton
                    aria-label="more"
                    aria-controls={`track-menu-${topTrack.id}`}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, topTrack)}
                    style={{
                      color: "black",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`track-menu-${topTrack.id}`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(
                      anchorEl && selectedTrack?.id === topTrack.id
                    )}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleAddToPlaylistClick}>
                      Add to Playlist
                    </MenuItem>
                  </Menu>
                  <Dialog
                    open={isPlaylistDialogOpen}
                    onClose={() => setPlaylistDialogOpen(false)}
                    slotProps={{
                      backdrop: {
                        style: {
                          backgroundColor: "rgba(0,0,0,0.03)",
                          boxShadow: "0px 0px 0px 0px",
                        },
                      },
                    }}
                  >
                    <DialogTitle>Choose a Playlist</DialogTitle>
                    <DialogContent>
                      <List>
                        {playlists.map((playlist) => (
                          <ListItem
                            button
                            key={playlist._id}
                            onClick={() => handleAddToPlaylist(playlist._id)}
                          >
                            <ListItemText primary={playlist.name} />
                          </ListItem>
                        ))}
                      </List>
                    </DialogContent>
                  </Dialog>

                  <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                  >
                    <Alert
                      onClose={handleCloseSnackbar}
                      severity={snackbar.severity}
                      sx={{ width: "100%" }}
                    >
                      {snackbar.message}
                    </Alert>
                  </Snackbar>
                </span>
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
