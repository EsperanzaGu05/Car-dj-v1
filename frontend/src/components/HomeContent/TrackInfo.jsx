import React, { useState, useEffect, useContext } from "react";
import "../HomeContent/MainContent.css";
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
import { AuthContext } from "../contexts/AuthContext";
import { useDispatch } from "react-redux";
import { setCurrentPlaylist, setCurrentTrack } from "../Player/playlistSlice";
import playButtonSrc from "../../assets/play-button.svg";
import {getAlbumTracks} from '../../utils/utils/index';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TrackInfo = ({ release, onPlay, showMenu = true }) => {
  

  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const { auth } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
<<<<<<< Updated upstream
  const { setCurrentPlaylist, setCurrentTrack} = playlistSlice.actions;
  const dispatch = useDispatch();
  const updatePlayerStatus = async (track) => {    
    try {
      const trackData = await getAlbumTracks(track.id);
      console.log(trackData.items[0].preview_url)
      dispatch(setCurrentPlaylist(trackData.items));
      dispatch(setCurrentTrack(0));
      // QUITAR LOADER
=======
  const dispatch = useDispatch();

  // Normalize the release object
  const normalizedRelease = {
    id: release.id || release.track?.id,
    name: release.name || release.track?.name,
    artists: release.artists || release.track?.artists || [],
    album: release.album || {
      images: release.images || release.album?.images || []
    },
    type: release.type || release.track?.type || 'track',
    preview_url: release.preview_url || release.track?.preview_url
  };

  const fetchSongDetails = async (songId) => {
    console.log("Fetching song details for ID:", songId);

    if (!songId) {
      console.error("No song ID provided");
      showSnackbar("Error: No song ID available", "error");
      return null;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/spotify/fetchSong?id=${songId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch song details:", response.status, errorData);
        throw new Error(errorData.error || "Failed to fetch song details");
      }

      const data = await response.json();
      console.log("Fetched song details:", data);
      return data;
    } catch (error) {
      console.error("Error fetching song details:", error.message);
      showSnackbar(`Error fetching song details: ${error.message}`, "error");
      return null;
    }
  };

  const updatePlayerStatus = async (track) => {
    try {
      let trackData;
      if (track.type === 'album') {
        trackData = await getAlbumTracks(track.id);
      } else if (track.type === 'track') {
        const songDetails = await fetchSongDetails(track.id);
        if (songDetails) {
          trackData = { items: [songDetails] };
        } else {
          trackData = { items: [track] };
        }
      } else {
        throw new Error('Unsupported track type');
      }

      console.log("Track data:", trackData);
      if (trackData.items && trackData.items.length > 0) {
        const firstTrack = trackData.items[0];
        if (firstTrack.preview_url) {
          dispatch(setCurrentPlaylist(trackData.items));
          dispatch(setCurrentTrack(0));
        } else {
          showSnackbar("This song doesn't have a preview URL.", "warning");
        }
      } else {
        showSnackbar("No playable tracks found.", "error");
      }
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error updating player status:", error);
      showSnackbar(`Error playing track: ${error.message}. Please try again.`, "error");
    }
  };

  useEffect(() => {
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [isPlaylistDialogOpen, auth]);

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

    const songDetails = await fetchSongDetails(normalizedRelease.id);
    if (!songDetails) {
      showSnackbar("Failed to fetch song details", "error");
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
            songId: songDetails.id,
            songName: songDetails.name,
            artist: songDetails.artists[0].name,
            imageUrl: songDetails.album.images[0].url,
            preview_url: songDetails.preview_url,
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
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

  const handlePlayClick = () => {
    console.log("Song ID:", normalizedRelease.id);
    updatePlayerStatus(normalizedRelease);
  };

  return (
    <div className="card-track" style={{ position: "relative" }}>
      <div className="play-button">
<<<<<<< Updated upstream
        <img src={playButtonSrc} alt="" onClick={() => updatePlayerStatus(release)}/>
=======
        <img
          src={playButtonSrc}
          alt=""
          onClick={handlePlayClick}
        />
>>>>>>> Stashed changes
      </div>
      {showMenu && (
        <IconButton
          aria-label="more"
          aria-controls="track-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          style={{
            position: "absolute",
            top: 5,
            right: -80,
            color: "white",
            backgroundColor: "transparent",
          }}
        >
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu
        id="track-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAddToPlaylistClick}>Add to Playlist</MenuItem>
      </Menu>
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {normalizedRelease.album.images[0]?.url && (
          <img
            src={normalizedRelease.album.images[0].url}
            width={"200px"}
            height={"200px"}
            alt={`${normalizedRelease.name}`}
          />
        )}
      </div>
      <div style={{ height: "25px", overflow: "hidden" }}>
<<<<<<< Updated upstream
        <span>{name}</span>
=======
        <div style={{ height: "25px", overflow: "hidden" }}>
          <span>{normalizedRelease.name}</span>
        </div>
        <span style={{ color: "#222222", opacity: 0.5 }}>
          {normalizedRelease.artists[0]?.name}
        </span>

        <Dialog
          open={isPlaylistDialogOpen}
          onClose={() => setPlaylistDialogOpen(false)}
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
>>>>>>> Stashed changes
      </div>
      <span style={{ color: "#222222", opacity: 0.5 }}>{artistName}</span>

      <Dialog
        open={isPlaylistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
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
    </div>
  );
};

export default TrackInfo;