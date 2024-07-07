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

export const getArtists = async () => {
    try {
        const URL = 'http://localhost:5000/api/spotify/artists'
        const response = await fetch(URL, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
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

