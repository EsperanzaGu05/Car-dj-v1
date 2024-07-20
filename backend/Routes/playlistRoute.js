import express from 'express';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    console.log('Decoded token:', decoded);
    req.userId = decoded.userId;
    next();
  });
};

router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;
  console.log('Creating playlist for user:', userId);
  const db = getDB();

  try {
    const result = await db.collection(collections.PLAYLIST).insertOne({
      name,
      userId,
      songs: []
    });
    res.status(201).json({ message: 'Playlist created', playlistId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating playlist', error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.userId;
  const db = getDB();

  try {
    const playlists = await db.collection(collections.PLAYLIST).find({ userId }).toArray();
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error: error.message });
  }
});

router.get('/:playlistId', verifyToken, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.userId;
  const db = getDB();

  try {
    const playlist = await db.collection(collections.PLAYLIST).findOne({ _id: new ObjectId(playlistId), userId });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error: error.message });
  }
});
router.post('/:playlistId/songs', verifyToken, async (req, res) => {
  const { playlistId } = req.params;
  const { songId, songName, artist, imageUrl, preview_url } = req.body; // Added preview_url here
  const userId = req.userId;
  const db = getDB();

  console.log("Received song details:", { songId, songName, artist, imageUrl, preview_url }); // Log received data

  try {
    const playlist = await db.collection(collections.PLAYLIST).findOne({ _id: new ObjectId(playlistId), userId });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    const songExists = playlist.songs.some(song => song.trackId === songId);
    if (songExists) {
      return res.status(400).json({ message: 'Song already exists in the playlist' });
    }

    await db.collection(collections.PLAYLIST).updateOne(
      { _id: new ObjectId(playlistId) },
      { $addToSet: { songs: { trackId: songId, name: songName, artist, imageUrl, preview_url } } } // Included preview_url here
    );
    res.status(200).json({ message: 'Song added to playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding song to playlist', error: error.message });
  }
});

router.delete('/:playlistId', verifyToken, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.userId;
  const db = getDB();

  try {
    const result = await db.collection(collections.PLAYLIST).deleteOne({ 
      _id: new ObjectId(playlistId), 
      userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Playlist not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Playlist removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing playlist', error: error.message });
  }
});

router.delete('/:playlistId/songs/:songId', verifyToken, async (req, res) => {
  const { playlistId, songId } = req.params;
  const userId = req.userId;
  const db = getDB();

  try {
    const result = await db.collection(collections.PLAYLIST).updateOne(
      { _id: new ObjectId(playlistId), userId },
      { $pull: { songs: { trackId: songId } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Playlist not found or you do not have permission to modify it' });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Song not found in the playlist' });
    }

    res.status(200).json({ message: 'Song removed from playlist successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing song from playlist', error: error.message });
  }
});

export default router;
