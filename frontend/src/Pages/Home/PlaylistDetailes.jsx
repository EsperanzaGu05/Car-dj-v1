import React, { useState, useEffect, useContext } from "react";
import { getPlaylists } from "../../utils/utils";
import { useParams } from "react-router-dom";
import { millisToMinutesAndSeconds } from "../../utils/functions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AuthContext } from "../../components/contexts/AuthContext";
import { useSubscription } from "../../components/contexts/SubscriptionContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import { setCurrentPlaylist, setCurrentTrack } from "../../components/Player/playlistSlice";
import playButtonSrc from "../../assets/play-button.svg";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlistDetails, setPlaylistsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const { subscriptionStatus } = useSubscription();
  const isSubscribed = subscriptionStatus === 'Subscribed';
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

  const fetchPlaylistDetails = async () => {
    try {
      const fetchedPlaylist = await getPlaylists(id);
      const currentTracks = fetchedPlaylist.tracks.items;
      const tracks = currentTracks.map((item) => item.track);
      setPlaylistsDetails(fetchedPlaylist);
      console.log(fetchedPlaylist);
      console.log(currentTracks);
    } catch (error) {
      setError("Error fetching playlist details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlaylistDetails();
      handleMenuClose();
    }
  }, [id]);

  const updatePlayerStatus = (track, index) => {
    if (!track || !track.preview_url) {
      console.error('Track or preview_url is not available');
      return;
    }

    const tracks = playlistDetails.tracks.items.map(item => item.track);
    dispatch(setCurrentPlaylist(tracks));
    dispatch(setCurrentTrack(index));
  };

  const handlePlayPlaylist = () => {
    if (playlistDetails.tracks.items && playlistDetails.tracks.items.length > 0) {
      updatePlayerStatus(playlistDetails.tracks.items[0].track, 0);
    }
  };

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
            songId: selectedTrack.track.id,
            songName: selectedTrack.track.name,
            artist: selectedTrack.track.artists[0].name,
            imageUrl: selectedTrack.track.album.images[0].url,
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
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTrack(track);
  };

  const handleSongClick = (track, index) => {
    setSelectedSong(track.id === selectedSong ? null : track.id);
    updatePlayerStatus(track, index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [isPlaylistDialogOpen]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "15px" }}>
        <div>
          <img
            src={playlistDetails.images[0].url}
            width={"200px"}
            height={"200px"}
            alt="Playlist image"
          />
        </div>
        <div>
          <h2 style={{ marginLeft: "15px" }}>{playlistDetails.name}</h2>
          <span
            style={{
              marginLeft: "15px",
              display: "flex",
              overflow: "hidden",
              height: "25px",
            }}
          >
            {playlistDetails.description}
          </span>
          <div style={{ padding: "10px" }}>
            <img src={playButtonSrc} alt="Play" onClick={handlePlayPlaylist} />
          </div>
        </div>
      </div>
      {playlistDetails.tracks.items ? (
        <div className="playlistSongsList">
          <ol style={{ paddingLeft: "0px" }}>
            {playlistDetails.tracks.items.map((song, index) => (
              <li
                key={song.track.id}
                className={`playlistTrackItems ${
                  song.track.id === selectedSong ? "selected" : ""
                }`}
                onClick={() => handleSongClick(song.track, index)}
              >
                <span>{index + 1}. </span>
                <span>{song.track.name}</span>
                <span>{song.track.artists[0].name}</span>
                <span>{millisToMinutesAndSeconds(song.track.duration_ms)}</span>
                <span>
                  <IconButton
                    aria-label="more"
                    aria-controls={`track-menu-${song.track.id}`}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, song)}
                    style={{
                      color: "black",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`track-menu-${song.track.id}`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(
                      anchorEl && selectedTrack?.track.id === song.track.id
                    )}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleAddToPlaylistClick} disabled={!isSubscribed}>
                      {isSubscribed ? "Add to Playlist" : "Subscribe to Add to Playlist"}
                    </MenuItem>
                  </Menu>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div>No songs available for this playlist.</div>
      )}
      <Dialog
        open={isPlaylistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: "rgba(0,0,0,0.03)",
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
    </div>
  );
};

export default PlaylistDetails;
