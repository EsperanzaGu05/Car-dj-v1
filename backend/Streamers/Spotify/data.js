import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { SpotifyConn } from "./spotify.js";

const router = express.Router();

router.get('/tracks', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Track ID is required' });
    }

    SpotifyConn(async (error, instance) => {
        if (error) {
            return res.status(error?.status || 500).json(error);
        }

        try {
            let track = await instance.get(`/tracks/${id}`);
            if (!track.data.preview_url) {
                return res.status(404).json({ error: 'No preview URL available for this track' });
            }
            return res.status(200).json({ ...track?.data });
        } catch (error) {
            console.error('Error fetching track from Spotify:', error);
            return res.status(500).json({ error: 'Failed to fetch track' });
        }
    });
});

router.get('/new-releases', (req, res) => {
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`/browse/new-releases?limit=50&offset=0`);
                
                let filteredAlbums = await Promise.all(data.data.albums.items.map(async (album) => {
                    let tracksData = await instance.get(`/albums/${album.id}/tracks?market=ES`);
                    let tracksWithPreviews = tracksData.data.items.filter(track => track.preview_url);
                    if (tracksWithPreviews.length > 0) {
                        album.tracks = tracksWithPreviews;
                        return album;
                    }
                    return null;
                }));

                filteredAlbums = filteredAlbums.filter(album => album !== null);
                data.data.albums.items = filteredAlbums;
                data.data.albums.total = filteredAlbums.length;

                return res.status(200).json({ ...data.data });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to fetch new releases' });
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
            try {
                let artistsData;
                if (ids) {
                    artistsData = await instance.get(`/artists?ids=${ids}`);
                } else {
                    let newAlbums = await instance.get(`/browse/new-releases?limit=15&offset=0`);
                    let artArray = newAlbums.data.albums.items.map(item => item.artists).flat();
                    artArray = Array.from(new Set(artArray.map(a => a.id))).map(id => artArray.find(a => a.id === id));
                    let idArray = artArray.map(artist => artist.id);
                    artistsData = await instance.get(`/artists?ids=${idArray.join(',')}`);
                }

                let filteredArtists = await Promise.all(artistsData.data.artists.map(async (artist) => {
                    let topTracksData = await instance.get(`artists/${artist.id}/top-tracks?market=ES`);
                    let tracksWithPreviews = topTracksData.data.tracks.filter(track => track.preview_url);
                    if (tracksWithPreviews.length > 0) {
                        artist.top_tracks = tracksWithPreviews;
                        return artist;
                    }
                    return null;
                }));

                filteredArtists = filteredArtists.filter(artist => artist !== null);
                artistsData.data.artists = filteredArtists;

                return res.status(200).json({ ...artistsData.data });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to fetch artists' });
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

router.get(`/artists/:id/albums`, (req, res) => {
    const { id } = req.params;

    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`artists/${id}/albums`);
                let filteredAlbums = await Promise.all(data.data.items.map(async (album) => {
                    let tracksData = await instance.get(`/albums/${album.id}/tracks?market=ES`);
                    let tracksWithPreviews = tracksData.data.items.filter(track => track.preview_url);
                    if (tracksWithPreviews.length > 0) {
                        album.tracks = tracksWithPreviews;
                        return album;
                    }
                    return null;
                }));
                filteredAlbums = filteredAlbums.filter(album => album !== null);
                data.data.items = filteredAlbums;
                data.data.total = filteredAlbums.length;
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to fetch artist albums' });
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

router.get(`/artists/:id/top-tracks`, (req, res) => {
    const { id } = req.params;

    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`artists/${id}/top-tracks?market=ES`);
                let tracksWithPreviews = data.data.tracks.filter(track => track.preview_url);
                data.data.tracks = tracksWithPreviews;
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to fetch artist top tracks' });
            }
        } else {
            return res.status(error?.status).json(error);
        }
    })
});

router.get(`/artists/:id/related-artists`, (req, res) => {
    const { id } = req.params;

    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`artists/${id}/related-artists`);
                let filteredArtists = await Promise.all(data.data.artists.map(async (artist) => {
                    let topTracksData = await instance.get(`artists/${artist.id}/top-tracks?market=ES`);
                    let tracksWithPreviews = topTracksData.data.tracks.filter(track => track.preview_url);
                    if (tracksWithPreviews.length > 0) {
                        artist.top_tracks = tracksWithPreviews;
                        return artist;
                    }
                    return null;
                }));
                filteredArtists = filteredArtists.filter(artist => artist !== null);
                data.data.artists = filteredArtists;
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to fetch related artists' });
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
            if (ids) {
                try {

                    let data = await instance.get(`/albums?ids=${ids}`);
                    return res.status(200).json({ ...data?.data });
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                let data = await instance.get("albums?ids=7aJuG4TFXa2hmE4z1yxc3n,1NAmidJlEaVgA3MpcPFYGq,5EYKrEDnKhhcNxGedaRQeK,3RQQmkQEvNCY4prGKE6oc5,4iqbFIdGOTzXeDtt9owjQn,18NOKLkZETa4sWwLMIm0UZ,6s84u2TUpR3wdUv4NgKA2j,6i7mF7whyRJuLJ4ogbH2wh,07w0rG5TETcyihsEIZR3qG,5quMTd5zeI9yW5UDua8wS4,168CdR21lfn0TTyw1Pkdcm,78bpIziExqiI9qztvNFlQu,3zu0hJJew2qXZNlselIQk8,5tSQtQGkrCJx3hoQxmLgfM,7txGsnDSqVMoRl6RQ9XyZP&market=CA");
                return res.status(200).json({ ...data?.data });
            }

        } else {
            return res.status(error?.status).json(error);
        }
    })
});


router.get('/playlists', async (req, res) => {
    const { id } = req.query;

    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data;
                if (id) {
                    data = await instance.get(`/playlists/${id}`);
                    data.data.tracks.items = data.data.tracks.items.filter(item => item.track && item.track.preview_url);
                } else {
                    console.log("Fetching featured playlists");
                    data = await instance.get('/browse/featured-playlists?offset=0&limit=20');
                    data.data.playlists.items = await Promise.all(data.data.playlists.items.map(async (playlist) => {
                        let playlistData = await instance.get(`/playlists/${playlist.id}`);
                        playlist.tracks = playlistData.data.tracks.items.filter(item => item.track && item.track.preview_url);
                        return playlist.tracks.length > 0 ? playlist : null;
                    }));
                    data.data.playlists.items = data.data.playlists.items.filter(playlist => playlist !== null);
                }

                return res.status(200).json({ ...data?.data });
            } catch (error) {
                return res.status(500).json({ message: 'Error fetching playlists', error });
            }
        } else {
            return res.status(error?.status).json(error);
        }
    });
});

router.get(`/albums/:id/tracks`, (req, res) => {
    const { id } = req.params;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`albums/${id}/tracks?market=IT`);
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    });
});

router.get(`/albums/:id/tracks`, (req, res) => {
    const { id } = req.params;
    SpotifyConn(async (error, instance) => {
        if (instance) {
            try {
                let data = await instance.get(`albums/${id}/tracks?market=ES`);
                return res.status(200).json({ ...data?.data });
            } catch (error) {
                console.log(error);
            }
        } else {
            return res.status(error?.status).json(error);
        }
    });
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
                
                if (data.data.tracks) {
                    data.data.tracks.items = data.data.tracks.items.filter(track => track.preview_url);
                }
                
                if (data.data.albums) {
                    data.data.albums.items = await Promise.all(data.data.albums.items.map(async (album) => {
                        let tracksData = await instance.get(`/albums/${album.id}/tracks?market=ES`);
                        let tracksWithPreviews = tracksData.data.items.filter(track => track.preview_url);
                        if (tracksWithPreviews.length > 0) {
                            album.tracks = tracksWithPreviews;
                            return album;
                        }
                        return null;
                    }));
                    data.data.albums.items = data.data.albums.items.filter(album => album !== null);
                }

                if (data.data.artists) {
                    data.data.artists.items = await Promise.all(data.data.artists.items.map(async (artist) => {
                        let topTracksData = await instance.get(`artists/${artist.id}/top-tracks?market=ES`);
                        let tracksWithPreviews = topTracksData.data.tracks.filter(track => track.preview_url);
                        if (tracksWithPreviews.length > 0) {
                            artist.top_tracks = tracksWithPreviews;
                            return artist;
                        }
                        return null;
                    }));
                    data.data.artists.items = data.data.artists.items.filter(artist => artist !== null);
                }

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

router.get('/fetchSong', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Song ID is required' });
    }

    SpotifyConn(async (error, instance) => {
        if (error) {
            return res.status(error?.status || 500).json(error);
        }

        try {
            let trackResponse = await instance.get(`/tracks/${id}`);
            if (!trackResponse.data.preview_url) {
                return res.status(404).json({ error: 'No preview URL available for this track' });
            }
            let track = trackResponse.data;

            let audioFeaturesResponse = await instance.get(`/audio-features/${id}`);
            let audioFeatures = audioFeaturesResponse.data;

            let songData = {
                id: track.id,
                name: track.name,
                artists: track.artists.map(artist => ({
                    id: artist.id,
                    name: artist.name
                })),
                album: {
                    id: track.album.id,
                    name: track.album.name,
                    images: track.album.images
                },
                duration_ms: track.duration_ms,
                preview_url: track.preview_url,
                popularity: track.popularity,
                explicit: track.explicit,
                external_urls: track.external_urls,
                tempo: audioFeatures.tempo,
                key: audioFeatures.key,
                mode: audioFeatures.mode,
                time_signature: audioFeatures.time_signature,
            };

            return res.status(200).json(songData);
        } catch (error) {
            console.error('Error fetching song from Spotify:', error);
            return res.status(500).json({ error: 'Failed to fetch song details' });
        }
    });
});

export default router;