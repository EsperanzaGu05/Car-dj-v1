import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AccountSidebar from './AccountSideBar';
import '../AsideBar/AsideBar.css';
import "../Button/Button.css";
import listSrc from "../../assets/list.png";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const LoggedInAsideBar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAccountSidebarOpen, setAccountSidebarOpen] = useState(false);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isSongsDialogOpen, setSongsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [playlistNameError, setPlaylistNameError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSongRemoveDialogOpen, setSongRemoveDialogOpen] = useState(false);
  const [songToRemove, setSongToRemove] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (isPlaylistDialogOpen) {
      fetchPlaylists();
    }
  }, [isPlaylistDialogOpen]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/playlists', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPlaylists(data);
        setError(null);
      } else {
        setPlaylists([]);
        setError(data.message || 'Failed to fetch playlists');
      }
    } catch (error) {
      setPlaylists([]);
      setError('Error fetching playlists');
    }
  };

  const fetchSongs = async (playlistId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setSongs(data.songs || []);
        setError(null);
      } else {
        setSongs([]);
        setError(data.message || 'Failed to fetch songs');
      }
    } catch (error) {
      setSongs([]);
      setError('Error fetching songs');
    }
  };

  const handleAccountClick = () => {
    setAccountSidebarOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePlaylistClick = () => {
    setPlaylistDialogOpen(true);
  };

  const handleCreatePlaylist = async () => {
    setPlaylistNameError('');
    setError(null);

    if (!newPlaylistName.trim()) {
      setPlaylistNameError('Please enter a playlist name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ name: newPlaylistName.trim() })
      });
      const data = await response.json();

      if (response.ok) {
        setNewPlaylistName('');
        fetchPlaylists();
      } else {
        setError(data.message || 'Failed to create playlist');
      }
    } catch (error) {
      setError('Error creating playlist');
    }
  };

  const handleMenuOpen = (event, playlist) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlaylist(playlist);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlaylist(null);
  };

  const handleRemovePlaylist = async () => {
    if (!selectedPlaylist) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/playlists/${selectedPlaylist._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (response.ok) {
        fetchPlaylists();
        setSnackbarMessage('Playlist removed successfully');
        setSnackbarOpen(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to remove playlist');
      }
    } catch (error) {
      setError('Error removing playlist');
    }

    handleMenuClose();
  };

  const handlePlaylistItemClick = async (playlist) => {
    setSelectedPlaylist(playlist);
    await fetchSongs(playlist._id);
    setSongsDialogOpen(true);
  };

  const handleRemoveSong = (song) => {
    setSongToRemove(song);
    setSongRemoveDialogOpen(true);
  };

  const confirmRemoveSong = async () => {
    if (!selectedPlaylist || !songToRemove) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/playlists/${selectedPlaylist._id}/songs/${songToRemove.trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (response.ok) {
        await fetchSongs(selectedPlaylist._id);
        setSnackbarMessage('Song removed from playlist');
        setSnackbarOpen(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to remove song');
      }
    } catch (error) {
      setError('Error removing song');
    }

    setSongRemoveDialogOpen(false);
    setSongToRemove(null);
  };

  if (!auth) {
    return null;
  }

  return (
    <div id="login-section">
      <span style={{ fontWeight: 500, color: 'black' }}>
        Welcome Back, {auth?.name || 'User'}
      </span>
      <br />
      <section id="info-login">
        Manage your account and explore new features.
      </section>
      <section id="login-section-button">
        <button onClick={handleLogout} className="login-button">Logout</button>
        <button onClick={handleAccountClick} className="login-button">Account</button>
      </section>
      <button onClick={handlePlaylistClick} className="my-playlist-button">
        <img src={listSrc} alt="My Playlist" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
        My Playlist
      </button>
      {isAccountSidebarOpen && <AccountSidebar onClose={() => setAccountSidebarOpen(false)} />}
      
      <Dialog open={isPlaylistDialogOpen} onClose={() => setPlaylistDialogOpen(false)}>
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
          <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
            Create New Playlist
          </Button>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <List>
            {playlists.map((playlist) => (
              <ListItem 
                key={playlist._id} 
                button 
                onClick={() => handlePlaylistItemClick(playlist)} 
                secondaryAction={
                  <IconButton edge="end" onClick={(event) => handleMenuOpen(event, playlist)}>
                    <MoreVertIcon />
                  </IconButton>
                }>
                <ListItemText primary={playlist.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlaylistDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRemovePlaylist}>Delete</MenuItem>
      </Menu>

      <Dialog open={isSongsDialogOpen} onClose={() => setSongsDialogOpen(false)}>
        <DialogTitle>Songs in {selectedPlaylist?.name}</DialogTitle>
        <DialogContent>
          {error && <p style={{color: 'red'}}>{error}</p>}
          {songs.length === 0 ? (
            <p>No songs in playlist</p>
          ) : (
            <List>
              {songs.map((song) => (
                <ListItem 
                  key={song.trackId} 
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveSong(song)}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={song.imageUrl} 
                      alt={song.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {!song.imageUrl && song.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={song.name} 
                    secondary={song.artist}
                    primaryTypographyProps={{ noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSongsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isSongRemoveDialogOpen} onClose={() => setSongRemoveDialogOpen(false)}>
        <DialogTitle>Remove Song</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove "{songToRemove?.name}" from the playlist?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSongRemoveDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRemoveSong} color="error">Remove</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoggedInAsideBar;