import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./components/Player/playlistSlice"; // Make sure the path is correct

const store = configureStore({
  reducer: {
    playlist: playlistReducer,
  },
});

export default store;
