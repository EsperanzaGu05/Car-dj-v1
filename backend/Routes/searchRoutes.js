// routes/searchRoutes.js
import express from 'express';
import spotifyApi, { refreshAccessToken } from '../spotifyClient.js';
import searchRoutes from './Routes/searchRoutes.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;

  try {
    const response = await spotifyApi.searchTracks(q);
    res.json(response.body.tracks.items);
  } catch (error) {
    if (error.statusCode === 401) {
      await refreshAccessToken();
      const response = await spotifyApi.searchTracks(q);
      res.json(response.body.tracks.items);
    } else {
      console.error('Error fetching data from Spotify API:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

export default router;
