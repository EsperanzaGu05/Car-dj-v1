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

  useEffect(() => {
    if (id) {
      fetchPlaylistDetails();
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
  return <div>PlaylistDetailes</div>;
};

export default PlaylistDetailes;
