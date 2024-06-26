import axios from 'axios';
import dotenv from "dotenv";
import qs from "querystring";
import { response } from 'express';

dotenv.config();

var clientId = "6f9b20a121f844a9a0447037369c5bdb";
var clientSecret = "1a03b56c1091421d9da8dc158154d96b";
var token;

const SpotifyConn = async (callback) => {
    const data = qs.stringify({
        grant_type: "client_credentials"
      });
    let response;
    try{
        console.log('Basic ' + (new Buffer.from(clientId + clientSecret).toString('base64')));
        response = await axios
        .post('https://accounts.spotify.com/api/token',data,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            }
        },
        );
        console.log(`access token received ${response.data.access_token}`);
    }catch(error){
        console.log(`Error in getting token: ${error.response?.data}`);
    }

    if (response && response.data && response.data.access_token) {
        const instance = axios.create({
          baseURL: "https://api.spotify.com/v1/",
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });
    
        console.log("Axios instance created with access token.");
        callback(undefined, instance);
      } else {
        console.error("Failed to receive access token.");
        callback(
          {
            status: 500,
            message: "Failed to receive access token",
            response:response
          },
          undefined
        );
      }
}

export {SpotifyConn};