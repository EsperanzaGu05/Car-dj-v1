export const getNewRealeases = async () => {
    try {
        const URL = 'http://localhost:5000/api/spotify/new-releases';
        const response = await fetch(URL, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getArtists = async (id = '') => {
    try {
        let URL = 'http://localhost:5000/api/spotify/artists';

        // Append id to URL if provided
        if (id) {
            URL += `?ids=${id}`;
        }

        const response = await fetch(URL, {
            method: "GET",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error; // Re-throw error to handle in the calling component
    }
};


export const getArtistAlbums = async (id = '') => {
    try {
        let URL = `http://localhost:5000/api/spotify/artists/${id}/albums`;

        const response = await fetch(URL, {
            method: "GET",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};

export const getArtistTopTracks = async (id = '') => {
    try {
        let URL = `http://localhost:5000/api/spotify/artists/${id}/top-tracks`;

        const response = await fetch(URL, {
            method: "GET",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};

export const getArtistRelated = async (id = '') => {
    try {
        let URL = `http://localhost:5000/api/spotify/artists/${id}/related-artists`;

        const response = await fetch(URL, {
            method: "GET",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};


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
        const response = await fetch(URL, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

// New function for search
export const searchSpotify = async (query) => {
    try {
        const URL = `http://localhost:5000/api/spotify/search?q=${encodeURIComponent(query)}`;
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