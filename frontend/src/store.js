import { configureStore } from "@reduxjs/toolkit";
import playlistSlice from "./components/Player/playlistSlice";

const store = configureStore({
    reducer: {
        playlist: playlistSlice.reducer
    }
})

export default store