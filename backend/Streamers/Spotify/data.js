import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { SpotifyConn } from "./spotify.js";

const app = express();

app.get('/track', (req, res) => {
    //let id='11dFghVXANMlKmJXsNCbNl';
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

// Getting artists from spotify for set of ids
app.get('/artists', (req, res) => {
    const { ids } = req.query;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            if (ids) {
                try {
                    let data = await instance.get(`/artists?ids=${ids}`);
                    return res.status(200).json({ ...data?.data });
                } catch (error) {
                    console.log(error);
                }
            } else {
                //When ids are not given this gives the artists of the newly released albums
                let newAlbums = await instance.get(`/browse/new-releases?limit=10&offset=0`);
                let artArray = newAlbums.data.albums.items.map(item => item.artists).flat();
                artArray = Array.from(new Set(artArray));
                let idArray = artArray.map(artist => artist.id);
                let data = await instance.get(`/artists?ids=${idArray.join(',')}`);
                return res.status(200).json({ ...data?.data });
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

app.get('/albums', (req, res) => {
    const { ids } = req.query;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`/albums?ids=${ids}`);
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