import { SpotifyConn } from "./Streamers/Spotify/spotify.js"



const songId = '5oG9sgHBJXG4QFHaUHTZwe'; // New track ID

const testSpotifyConn = async () => {
  try {
    // Initialize Spotify connection
    SpotifyConn((error, spotifyApi) => {
      if (error) {
        console.error('Error initializing Spotify connection:', error);
        return;
      }

      const requestUrl = `/tracks/${songId}`;
      console.log('Request URL:', requestUrl);

      // Fetch song details
      spotifyApi
        .get(requestUrl)
        .then((response) => {
          console.log('Song details:', response.data);
        })
        .catch((error) => {
          console.error('Error fetching song details:', error.response?.data || error.message);
        });
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Run the test
testSpotifyConn();