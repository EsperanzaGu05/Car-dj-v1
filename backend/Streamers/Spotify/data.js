import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { SpotifyConn } from "./spotify.js";

const app = express();

// Existing endpoints...

app.get('/track', (req, res) => {
    const { id } = req.query;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let track = await instance.get(`/tracks/${id}?market=ES`);
                return res.status(200).json({ ...track?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

app.get('/new-releases', (req, res) => {
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`/browse/new-releases?limit=40&offset=0`);
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

// Existing endpoints...

// Adding search endpoint
app.get('/search', (req, res) => {
    const { q } = req.query;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`/search`, {
                    params: {
                        q,
                        type: 'track,artist,album'
                    }
                });
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

export default app;
