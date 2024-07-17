import React, { useState, useEffect, useContext } from "react";
import { getPlaylists } from "../../utils/utils";
import { useParams } from "react-router-dom";
import { millisToMinutesAndSeconds } from "../../utils/functions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AuthContext } from "../../components/contexts/AuthContext";

const PlaylistDetailes = () => {
  const { id } = useParams();
  const [playlistDetails, setPlaylistsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);

  const fetchPlaylistDetails = async () => {
    try {
      const fetchedPlaylist = await getPlaylists(id);

      setPlaylistsDetails(fetchedPlaylist);

      console.log(fetchedPlaylist);
    } catch (error) {
      setError("Error fetching album details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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
            songId: release.id,
            songName: release.name,
            artist: artistName,
            imageUrl: imageUrl,
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
      fetchPlaylistDetails();
      handleMenuClose();
    }
  }, [id]);

  const playlist = playlistDetails;

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
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "15px" }}>
        <div>
          <img src={playlist.images[0].url} width={"200px"} height={"200px"} />
        </div>
        <div>
          <h2 style={{ marginLeft: "15px" }}>{playlist.name}</h2>
          <span style={{ marginLeft: "15px" }}>{playlist.description}</span>
        </div>
      </div>
      {playlist ? (
        <div className="albumSongsList">
          <ol>
            {playlist.tracks.items.map((playlist, index) => (
              <li key={playlist.track.id} className="albumSongsItems">
                <span>{index + 1}. </span>
                <span>{playlist.track.name}</span>
                <span>{playlist.track.artists[0].name}</span>
                <span>
                  {millisToMinutesAndSeconds(playlist.track.duration_ms)}
                </span>
                <span>
                  <IconButton
                    aria-label="more"
                    aria-controls="track-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    style={{
                      color: "black",
                      backgroundColor: "transparent",
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
                    <MenuItem onClick={handleAddToPlaylistClick}>
                      Add to Playlist
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
    </div>
  );
};

export default PlaylistDetailes;
