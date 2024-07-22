import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getAlbums } from "../../utils/utils";
import { millisToMinutesAndSeconds } from "../../utils/functions";
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
import { useSubscription } from "../../components/contexts/SubscriptionContext";
import { useDispatch } from "react-redux";
import { setCurrentPlaylist, setCurrentTrack } from "../../components/Player/playlistSlice";
import playButtonSrc from "../../assets/play-button.svg";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlbumsDetails = () => {
  const { id } = useParams();
  const [albumTracks, setAlbumTracks] = useState({});
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const { subscriptionStatus } = useSubscription();
  const isSubscribed = subscriptionStatus === 'Subscribed';
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
  const [ismenuOpen, setisMenuOpen] = useState(false);

  const fetchAlbumDetails = async () => {
    try {
      const fetchedAlbum = await getAlbums(id);
      const currentTracks = fetchedAlbum.albums[0].tracks.items;
      setAlbumTracks({
        name: fetchedAlbum.albums[0].name,
        artist: fetchedAlbum.albums[0].artists[0].name,
        image: fetchedAlbum.albums[0].images[0].url,
        id: fetchedAlbum.albums[0].id,
        currentTracks,
      });

      //dispatch(setCurrentPlaylist(currentTracks));
      console.log(fetchedAlbum);
      console.log(currentTracks);
    } catch (error) {
      setError("Error fetching album details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [isPlaylistDialogOpen]);

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

  const handleAddToPlaylist = async (playlistId) => {
    if (!auth) {
      showSnackbar("You need an account to add songs to a playlist", "error");
      return;
    }
    if (!isSubscribed) {
      showSnackbar("You need an active subscription to add songs to playlists", "error");
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
            artist: albumTracks.artist,
            imageUrl: albumTracks.image,
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
    setisMenuOpen(true);
    event.stopPropagation();
  };

  const handleSongClick = (track) => {
    setSelectedSong(track.id === selectedSong ? null : track.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setisMenuOpen(false);
  };

  const handleAddToPlaylistClick = () => {
    if (!auth) {
      showSnackbar("You need an account to add songs to a playlist", "error");
      return;
    }
    if (!isSubscribed) {
      showSnackbar("You need an active subscription to add songs to playlists", "error");
      return;
    }
    setPlaylistDialogOpen(true);
    handleMenuClose();
  };

  useEffect(() => {
    if (id) {
      fetchAlbumDetails();
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
    if(!ismenuOpen){
      dispatch(setCurrentPlaylist(albumTracks.currentTracks));
      dispatch(setCurrentTrack(track));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "15px" }}>
        <div>
          <img
            src={albumTracks.image}
            width={"200px"}
            height={"200px"}
            alt="Playlist image"
          />
        </div>
        <div>
          <h2 style={{ marginLeft: "15px" }}>{albumTracks.name}</h2>
          <span style={{ marginLeft: "15px" }}>{albumTracks.artist}</span>
          <div style={{ padding: "10px" }}>
            <img src={playButtonSrc} alt="" onClick={() => updatePlaylist(0)} />
          </div>
        </div>
      </div>
      {albumTracks.currentTracks ? (
        <div className="albumSongsList">
          <ol style={{ padding: "0px" }}>
            {albumTracks.currentTracks.map((track, index) => (
              <li
                key={track.id}
                className={`albumSongsItems ${
                  track.id === selectedSong ? "selected" : ""
                }`}
                onClick={() => {
                  handleSongClick(track);
                  updatePlaylist(index);
                }}
              >
                <span>{index + 1}. </span>
                <span>{track.name}</span>
                <span>{track.artists[0].name}</span>
                <span>{millisToMinutesAndSeconds(track.duration_ms)}</span>
                <span>
                  <IconButton
                    aria-label="more"
                    aria-controls={`track-menu-${track.id}`}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, track)}
                    style={{
                      color: "black",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`track-menu-${track.id}`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl && selectedTrack?.id === track.id)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleAddToPlaylistClick} disabled={!isSubscribed}>
                      {isSubscribed ? "Add to Playlist" : "Subscribe to Add to Playlist"}
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
                      {isSubscribed ? (
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
                      ) : (
                        <p>You need an active subscription to add songs to playlists.</p>
                      )}
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
        </div>
      ) : (
        <span className="loader">Loading...</span>
      )}
    </div>
  );
};

export default AlbumsDetails;