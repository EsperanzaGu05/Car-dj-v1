import React, { useState, useEffect, useContext } from "react";
import { getAlbums, getTracks } from "../../utils/utils";
import { useParams } from "react-router-dom";
import { millisToMinutesAndSeconds } from "../../utils/functions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AuthContext } from "../../components/contexts/AuthContext";
import { useDispatch } from "react-redux";
import Store from "../../components/Player/playlistSlice";
const { setCurrentPlaylist, setCurrentTrack } = Store.actions;

import playButtonSrc from "../../assets/play-button.svg";

const AlbumsDetails = () => {
  const { id } = useParams();
  const [albumTracks, setAlbumTracks] = useState({});
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const fetchAlbumDetails = async () => {
    try {
      const fetchedAlbum = await getAlbums(id);
      const currentTracks = fetchedAlbum.albums[0].tracks.items;
      setAlbumTracks({
        name: fetchedAlbum.albums[0].name,
        artist: fetchedAlbum.albums[0].artists[0].name,
        image: fetchedAlbum.albums[0].images[0].url,
        currentTracks,
      });

      dispatch(setCurrentPlaylist(currentTracks));
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
    dispatch(setCurrentTrack(track));
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
            <img src={playButtonSrc} alt="" onClick={() => updatePlaylist(1)} />
          </div>
        </div>
      </div>
      {albumTracks.currentTracks ? (
        <div className="albumSongsList">
          <ol>
            {albumTracks.currentTracks.map((track, index) => (
              <li key={track.id} className="albumSongsItems">
                <div>
                  <img
                    style={{ width: "30px", height: "30px" }}
                    src={playButtonSrc}
                    alt=""
                    onClick={() => updatePlaylist(index)}
                  />
                </div>
                <span>{index + 1}. </span>
                <span>{track.name}</span>
                <span>{track.artists[0].name}</span>
                <span>{millisToMinutesAndSeconds(track.duration_ms)}</span>
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

export default AlbumsDetails;
