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
  const isSubscribed = subscriptionStatus === 'Subscribed' || subscriptionStatus === 'Cancelled';
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

  const updatePlayerStatus = async (track, index) => {
    if (!track || !track.preview_url) {
      console.error('Track or preview_url is not available');
      return;
    }

    const songDetails = await fetchSongDetails(track.id);
    if (songDetails) {
      dispatch(setCurrentPlaylist([songDetails]));
      dispatch(setCurrentTrack(0));
    } else {
      showSnackbar("Failed to fetch song details", "error");
    }
  };

  const handlePlayAlbum = async () => {
    if (albumTracks.currentTracks && albumTracks.currentTracks.length > 0) {
      const playlistSongs = await Promise.all(
        albumTracks.currentTracks.map(track => fetchSongDetails(track.id))
      );
      dispatch(setCurrentPlaylist(playlistSongs.filter(Boolean)));
      dispatch(setCurrentTrack(0));
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

    const songDetails = await fetchSongDetails(selectedTrack.id);
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
      showSnackbar("You need an active or recently cancelled subscription to add songs to playlists", "error");
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
            src={albumTracks.image}
            width={"200px"}
            height={"200px"}
            alt="Album cover"
          />
        </div>
        <div>
          <h2 style={{ marginLeft: "15px" }}>{albumTracks.name}</h2>
          <span style={{ marginLeft: "15px" }}>{albumTracks.artist}</span>
          <div style={{ padding: "10px" }}>
            <img src={playButtonSrc} alt="Play" onClick={handlePlayAlbum} />
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
                onClick={() => handleSongClick(track, index)}
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
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <span className="loader">Loading...</span>
      )}
      
      <Dialog
        open={isPlaylistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
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
            <p>You need an active  subscription to add songs to playlists.</p>
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

export default AlbumsDetails;