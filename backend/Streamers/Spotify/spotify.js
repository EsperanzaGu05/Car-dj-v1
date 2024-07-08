import axios from 'axios';
import dotenv from "dotenv";
import qs from "querystring";

dotenv.config();

// Function to connect to Spotify and get an access token
const SpotifyConn = async (callback) => {
    // Data for the request
    const data = qs.stringify({
        grant_type: "client_credentials"
    });

    // Headers including the encoded client credentials
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    };

    try {
        // Request to get the access token
        const response = await axios.post('https://accounts.spotify.com/api/token', data, { headers });
        console.log(`Access token received: ${response.data.access_token}`);

        // Create an axios instance with the access token
        const spotifyApi = axios.create({
            baseURL: "https://api.spotify.com/v1/",
            headers: {
                Authorization: `Bearer ${response.data.access_token}`
            }
        });

        console.log("Axios instance created with access token.");
        callback(undefined, spotifyApi);

    } catch (error) {
        console.error("Failed to receive access token:", error.response ? error.response.data : error.message);
        callback({
            status: 500,
            message: "Failed to receive access token",
            error: error.response ? error.response.data : error
        }, undefined);
    }
}

// Export the Spotify connection function
export { SpotifyConn as spotifyApi };
