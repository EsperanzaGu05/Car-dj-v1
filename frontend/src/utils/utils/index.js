// Add a timestamp to prevent caching
const addTimestamp = (url) => {
    const timestamp = new Date().getTime();
    return `${url}${url.includes('?') ? '&' : '?'}_=${timestamp}`;
};

export const getNewRealeases = async () => {
    try {
        const URL = addTimestamp('http://localhost:5000/api/spotify/new-releases');
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching new releases:", error);
        throw error;
    }
};

export const getArtists = async (id = '') => {
    try {
        let URL = 'http://localhost:5000/api/spotify/artists';
        if (id) {
            URL += `?ids=${id}`;
        }
        URL = addTimestamp(URL);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};

<<<<<<< Updated upstream
=======
export const getAlbums = async (id = '') => {
    try {
        let URL = 'http://localhost:5000/api/spotify/albums';
        if (id) {
            URL += `?ids=${id}`;
        }
        URL = addTimestamp(URL);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};
>>>>>>> Stashed changes

export const getArtistAlbums = async (id = '') => {
    try {
        let URL = addTimestamp(`http://localhost:5000/api/spotify/artists/${id}/albums`);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        throw error;
    }
};

export const getArtistTopTracks = async (id = '') => {
    try {
        let URL = addTimestamp(`http://localhost:5000/api/spotify/artists/${id}/top-tracks`);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artist top tracks:', error);
        throw error;
    }
};

export const getArtistRelated = async (id = '') => {
    try {
        let URL = addTimestamp(`http://localhost:5000/api/spotify/artists/${id}/related-artists`);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching related artists:', error);
        throw error;
    }
};

<<<<<<< Updated upstream

export const getPlaylists = async () => {
    try {
        const URL = 'http://localhost:5000/api/spotify/playlists'
        const response = await fetch(URL, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getAlbums = async () => {
    try {
        const URL = 'http://localhost:5000/api/spotify/albums'
=======
export const getPlaylists = async (id = '') => {
    try {
        let URL = 'http://localhost:5000/api/spotify/playlists';
        if (id) {
            URL += `?id=${id}`;
        }
        URL = addTimestamp(URL);
>>>>>>> Stashed changes
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching playlists:', error);
        throw error;
    }
};

export const getAlbumTracks = async (id = '') => {
    try {
        let URL = addTimestamp(`http://localhost:5000/api/spotify/albums/${id}/tracks`);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tracks of the album:', error);
        throw error;
    }
};

<<<<<<< Updated upstream
// New function for search
=======
export const getTracks = async (id = '') => {
    try {
        let URL = addTimestamp(`http://localhost:5000/api/spotify/tracks?id=${id}`);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
};

>>>>>>> Stashed changes
export const searchSpotify = async (query) => {
    try {
        const URL = addTimestamp(`http://localhost:5000/api/spotify/search?q=${encodeURIComponent(query)}`);
        const response = await fetch(URL, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching Spotify:", error);
        throw error;
    }
};