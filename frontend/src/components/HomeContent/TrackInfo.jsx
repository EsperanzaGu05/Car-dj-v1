import React, { useState, useEffect, useContext } from "react";
import "../HomeContent/MainContent.css";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AuthContext } from '../contexts/AuthContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TrackInfo = ({ release }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const { auth } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [isPlaylistDialogOpen]);

  const fetchPlaylists = async () => {
    if (!auth) {
      showSnackbar('You need an account to add songs to a playlist', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/playlists', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPlaylists(data);
      } else {
        console.error('Failed to fetch playlists:', data);
        showSnackbar('Failed to fetch playlists', 'error');
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      showSnackbar('Error fetching playlists', 'error');
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!auth) {
      showSnackbar('You need an account to add songs to a playlist', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/user/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ 
          songId: release.id, 
          songName: release.name,
          artist: artistName,
          imageUrl: imageUrl
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Song added to playlist successfully');
        showSnackbar('Song added to playlist successfully', 'success');
      } else {
        console.error('Failed to add song to playlist:', data);
        showSnackbar(data.message || 'Failed to add song to playlist', 'error');
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      showSnackbar('Error adding song to playlist', 'error');
    }
    setPlaylistDialogOpen(false);
    setAnchorEl(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (!release) {
    return <div>No release information available</div>;
  }

  const isTrack = release.type === 'track';
  const imageUrl = isTrack ? release.album?.images[0]?.url : release.images?.[0]?.url;
  const name = release.name || 'Unknown';
  const artistName = isTrack ? release.artists?.[0]?.name : release.artists?.[0]?.name || 'Unknown Artist';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToPlaylistClick = () => {
    if (!auth) {
      showSnackbar('You need an account to add songs to a playlist', 'error');
      return;
    }
    setPlaylistDialogOpen(true);
    handleMenuClose();
  };

  return (
    <div className="card-track" style={{ position: 'relative' }}>
      <IconButton 
        aria-label="more"
        aria-controls="track-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        style={{ 
          position: 'absolute', 
          top: 5, 
          right: 5, 
          color: '#1976d2',
          backgroundColor: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="track-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAddToPlaylistClick}>Add to Playlist</MenuItem>
      </Menu>
      <div style={{
        paddingBottom: "10px",
        display: "flex",
        justifyContent: "center",
      }}>
        {imageUrl && (
          <img
            src={imageUrl}
            width={"200px"}
            height={"200px"}
            alt={`${name}`}
          />
        )}
      </div>
      <span>{name}</span>
      <span style={{ color: "#222222", opacity: 0.5 }}>
        {artistName}
      </span>

      <Dialog open={isPlaylistDialogOpen} onClose={() => setPlaylistDialogOpen(false)}>
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TrackInfo;