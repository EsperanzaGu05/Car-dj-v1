import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { SpotifyConn } from "./spotify.js";

const router = express.Router();

router.get('/track', (req, res) => {
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

router.get('/new-releases', (req, res) => {
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

router.get('/artists', (req, res) => {
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
                let newAlbums = await instance.get(`/browse/new-releases?limit=15&offset=0`);
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

router.get('/albums', (req, res) => {
    const { ids } = req.query;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get("albums?ids=7aJuG4TFXa2hmE4z1yxc3n,1NAmidJlEaVgA3MpcPFYGq,5EYKrEDnKhhcNxGedaRQeK,3RQQmkQEvNCY4prGKE6oc5,4iqbFIdGOTzXeDtt9owjQn,18NOKLkZETa4sWwLMIm0UZ,6s84u2TUpR3wdUv4NgKA2j,6i7mF7whyRJuLJ4ogbH2wh,07w0rG5TETcyihsEIZR3qG,5quMTd5zeI9yW5UDua8wS4,168CdR21lfn0TTyw1Pkdcm,78bpIziExqiI9qztvNFlQu,3zu0hJJew2qXZNlselIQk8,5tSQtQGkrCJx3hoQxmLgfM,7txGsnDSqVMoRl6RQ9XyZP&market=ES");
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

router.get('/playlists', (req, res) => {
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get('/browse/featured-playlists?offset=0&limit=20');
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

router.get('/search', (req, res) => {
    console.log("Search endpoint hit:", req.query);
    const { q, type } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const searchTypes = type || 'track,artist,album';
    
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                const data = await instance.get(`/search?q=${encodeURIComponent(q)}&type=${searchTypes}&limit=20`);
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "An error occurred while searching" });
            }
        } else {
            return res.status(error?.status).json(error);
        }
    });
});

export default router;