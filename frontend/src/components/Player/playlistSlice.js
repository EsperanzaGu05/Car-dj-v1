import { createSlice } from "@reduxjs/toolkit"

const playlistSlice = createSlice({
    name: 'playerData',
    initialState:{
        playlist:
        [
            { preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name:"song 1" },
            { preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name:"song 2" },
            { preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', name:"song 3" }
        ],
        trackid: 0
    },
    reducers: {
        setCurrentPlaylist: (state, action) => {
            state.playlist = action.payload
        },
        setCurrentTrack: (state, action) => {
            state.trackid = action.payload
        }
    }
})

export default playlistSlice;