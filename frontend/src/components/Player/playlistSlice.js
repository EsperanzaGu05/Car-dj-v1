import { createSlice } from "@reduxjs/toolkit"

const playlistSlice = createSlice({
    name: 'playerData',
    initialState: {
        playlist:
            [
            ],
        trackid: null
    },
    reducers: {
        setCurrentPlaylist: (state, action) => {
            state.playlist = action.payload
        },
        setCurrentTrack: (state, action) => {
            console.log('action: ', action);
            state.trackid = action.payload
        }
    }
})

export default playlistSlice;