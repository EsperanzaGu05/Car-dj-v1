import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useDispatch } from 'react-redux';
import { setCurrentPlaylist, setCurrentTrack } from "../Player/playlistSlice"; // Import the action creators
import AccountSidebar from "./AccountSideBar";
import "../AsideBar/AsideBar.css";
import "../Button/Button.css";
import listSrc from "../../assets/list.png";
import playButtonSrc from "../../assets/play-button.svg"; // Import play button image
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AsidebarLoggedIn = () => {
  const { auth, logout } = useContext(AuthContext);
  const { daysLeft, subscriptionStatus, handleBuySubscription } = useSubscription();
  const { playlists, songs, error, fetchPlaylists, fetchSongs, createPlaylist, removePlaylist, removeSong } = usePlaylist();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isAccountSidebarOpen, setAccountSidebarOpen] = useState(false);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSongsDialogOpen, setSongsDialogOpen] = useState(false);
  const [playlistNameError, setPlaylistNameError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSongRemoveDialogOpen, setSongRemoveDialogOpen] = useState(false);
  const [songToRemove, setSongToRemove] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (location.state?.showSubscriptionSuccess) {
      setSnackbarMessage("You've successfully subscribed!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate(location.pathname, { replace: true });
    } else if (location.state?.showSubscriptionError) {
      setSnackbarMessage("Subscription activation failed. Please contact support.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [isPlaylistDialogOpen, fetchPlaylists]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAccountClick = () => {
    setAccountSidebarOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePlaylistClick = () => {
    setPlaylistDialogOpen(true);
  };

  const handleCreatePlaylist = async () => {
    setPlaylistNameError("");

    if (subscriptionStatus !== 'Subscribed') {
      setSnackbarMessage("You need to subscribe in order to create a playlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!newPlaylistName.trim()) {
      setPlaylistNameError("Please enter a playlist name");
      return;
    }

    const playlistExists = playlists.some(
      (playlist) =>
        playlist.name.toLowerCase() === newPlaylistName.trim().toLowerCase()
    );
    if (playlistExists) {
      setPlaylistNameError("A playlist with this name already exists");
      return;
    }

    const result = await createPlaylist(newPlaylistName);
    if (result.success) {
      setNewPlaylistName("");
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchPlaylists();
    } else {
      setPlaylistNameError(result.message);
    }
  };

  const handleMenuOpen = (event, playlist) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlaylist(playlist);
    event.stopPropagation();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlaylist(null);
  };

  const handleRemovePlaylist = async () => {
    if (!selectedPlaylist) return;

    const result = await removePlaylist(selectedPlaylist._id);
    if (result.success) {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchPlaylists();
    } else {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    handleMenuClose();
  };

  const handlePlaylistItemClick = async (playlist) => {
    setSelectedPlaylist(playlist);
    dispatch(setCurrentPlaylist(playlist.songs || [])); // Set the playlist songs in Redux
    dispatch(setCurrentTrack(0)); // Start with the first track
    await fetchSongs(playlist._id);
    setSongsDialogOpen(true);
  };
  
  const handleRemoveSong = (song) => {
    setSongToRemove(song);
    setSongRemoveDialogOpen(true);
  };

  const confirmRemoveSong = async () => {
    if (!selectedPlaylist || !songToRemove) return;

    const result = await removeSong(selectedPlaylist._id, songToRemove.trackId);
    if (result.success) {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      await fetchSongs(selectedPlaylist._id);
    } else {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setSongRemoveDialogOpen(false);
    setSongToRemove(null);
  };

  const handleSubscriptionButton = async () => {
    if (subscriptionStatus === 'Subscribed') {
      navigate('/manage-subscription');
      return;
    }

    try {
      const checkoutUrl = await handleBuySubscription();
      window.location.href = checkoutUrl;
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const updatePlayerStatus = (track) => {
    if (!track || !track.preview_url) {
      console.error('Track or preview_url is not available');
      return;
    }

    dispatch(setCurrentPlaylist([track]));
    dispatch(setCurrentTrack(0));
  };

  if (!auth) {
    return null;
  }
  return (
    <div>
      <div className="login-section">
        <span className="login-section-text">
          Welcome Back, {auth?.name || "User"}
        </span>
        <section className="info-login">
          Manage your account and explore new features.
        </section>
        <section className="login-section-button">
          <button onClick={handleLogout} className="login-button">
            Logout
          </button>
          <button onClick={handleAccountClick} className="login-button">
            Account
          </button>
        </section>
        {isAccountSidebarOpen && (
          <AccountSidebar onClose={() => setAccountSidebarOpen(false)} />
        )}
  
        <Dialog
          open={isPlaylistDialogOpen}
          onClose={() => setPlaylistDialogOpen(false)}
        >
          <DialogTitle>My Playlists</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New Playlist Name"
              type="text"
              fullWidth
              variant="standard"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              error={!!playlistNameError}
              helperText={playlistNameError}
            />
            <Button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim() || subscriptionStatus !== 'Subscribed'}
            >
              Create New Playlist
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <List>
              {playlists.map((playlist) => (
                <ListItem
                  button
                  key={playlist._id || playlist.name}
                  onClick={() => handlePlaylistItemClick(playlist)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="more"
                      onClick={(event) => handleMenuOpen(event, playlist)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={playlist.coverImage || listSrc} />
                  </ListItemAvatar>
                  <ListItemText primary={playlist.name} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPlaylistDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
  
        <Dialog
          open={isSongsDialogOpen}
          onClose={() => setSongsDialogOpen(false)}
        >
          <DialogTitle>{selectedPlaylist?.name}</DialogTitle>
          <DialogContent>
            {songs.length > 0 ? (
              <List>
                {songs.map((song) => (
                  <ListItem
                    key={song.trackId || song.name}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveSong(song)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={song.albumArt || song.imageUrl} alt={song.name}>
                        {!song.albumArt && !song.imageUrl && song.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={song.name || song.trackName}
                      secondary={song.artist || song.artistName}
                    />
                    <div className="play-button">
                      <img
                        src={playButtonSrc}
                        alt="Play"
                        onClick={() => updatePlayerStatus(song)}
                      />
                    </div>
                  </ListItem>
                ))}
              </List>
            ) : (
              <p>No songs in playlist</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSongsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
  
        <Dialog
          open={isSongRemoveDialogOpen}
          onClose={() => setSongRemoveDialogOpen(false)}
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to remove this song?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSongRemoveDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmRemoveSong} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
  
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleRemovePlaylist}>Delete Playlist</MenuItem>
        </Menu>
  
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} elevation={6} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
  
      <button
        onClick={handleSubscriptionButton}
        className="feature-button"
        style={{ fontWeight: "400", fontFamily: "poppins" }}
        disabled={subscriptionStatus === 'Subscribed'}
      >
        {subscriptionStatus === 'Subscribed' 
          ? `Subscribed (${daysLeft ?? 0} days left)`
          : "Buy Subscription"}
      </button>
  
      <button
        onClick={handlePlaylistClick}
        className="feature-button"
        style={{ fontWeight: "400", fontFamily: "poppins" }}
      >
        <img
          src={listSrc}
          alt="My Playlist"
          style={{
            width: "20px",
            height: "20px",
            marginRight: "8px",
          }}
        />
        My Playlists
      </button>
    </div>
  );
  
};
  
export default AsidebarLoggedIn;
