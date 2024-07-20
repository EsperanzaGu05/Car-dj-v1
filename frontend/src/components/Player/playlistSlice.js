import { createSlice } from "@reduxjs/toolkit";

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlist: [],
    trackid: 0
  },
  reducers: {
    setCurrentPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setCurrentTrack: (state, action) => {
      console.log('action: ', action);
      state.trackid = action.payload;
    }
  }
});

export const { setCurrentPlaylist, setCurrentTrack } = playlistSlice.actions;
export default playlistSlice.reducer;
