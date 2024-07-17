import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  const fetchPlaylists = useCallback(async () => {
    if (!auth || !auth.token) return; // Don't fetch if not authenticated

    try {
      const response = await fetch("http://localhost:5000/api/user/playlists", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setPlaylists(data);
        setError(null);
      } else {
        setPlaylists([]);
        setError(data.message || "Failed to fetch playlists");
      }
    } catch (error) {
      setPlaylists([]);
      setError("Error fetching playlists");
    }
  }, [auth]);

  const fetchSongs = useCallback(async (playlistId) => {
    if (!auth || !auth.token) return; // Don't fetch if not authenticated

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSongs(data.songs || []);
        setError(null);
      } else {
        setSongs([]);
        setError(data.message || "Failed to fetch songs");
      }
    } catch (error) {
      setSongs([]);
      setError("Error fetching songs");
    }
  }, [auth]);

  const createPlaylist = useCallback(async (name) => {
    if (!auth || !auth.token) return { success: false, message: "Not authenticated" };

    try {
      const response = await fetch("http://localhost:5000/api/user/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        await fetchPlaylists();
        return { success: true, message: "Playlist created successfully" };
      } else {
        return { success: false, message: data.message || "Failed to create playlist" };
      }
    } catch (error) {
      return { success: false, message: "Error creating playlist" };
    }
  }, [auth, fetchPlaylists]);

  const removePlaylist = useCallback(async (playlistId) => {
    if (!auth || !auth.token) return { success: false, message: "Not authenticated" };

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/playlists/${playlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchPlaylists();
        return { success: true, message: "Playlist removed successfully" };
      } else {
        const data = await response.json();
        return { success: false, message: data.message || "Failed to remove playlist" };
      }
    } catch (error) {
      return { success: false, message: "Error removing playlist" };
    }
  }, [auth, fetchPlaylists]);

  const removeSong = useCallback(async (playlistId, trackId) => {
    if (!auth || !auth.token) return { success: false, message: "Not authenticated" };

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/playlists/${playlistId}/songs/${trackId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchSongs(playlistId);
        return { success: true, message: "Song removed from playlist" };
      } else {
        const data = await response.json();
        return { success: false, message: data.message || "Failed to remove song" };
      }
    } catch (error) {
      return { success: false, message: "Error removing song" };
    }
  }, [auth, fetchSongs]);

  useEffect(() => {
    if (auth && auth.token) {
      fetchPlaylists();
    }
  }, [auth, fetchPlaylists]);

  const value = {
    playlists,
    songs,
    error,
    fetchPlaylists,
    fetchSongs,
    createPlaylist,
    removePlaylist,
    removeSong,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};