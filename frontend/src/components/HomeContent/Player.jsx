import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import playlistSlice from "../Player/playlistSlice";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "../HomeContent/Player.css";

const PlayerApp = ({ className }) => {
  let playlist = useSelector((state) => state.playlist.playlist);
  let trackId = useSelector((state) => state.playlist.trackid);
  const setCurrentTrack = playlistSlice.actions.setCurrentTrack;
  console.log("Rendering PlayerApp with playlist:", playlist);

  const handleClickNext = () => {
    console.log("click next ", playlist.length, " track:", trackId);

    trackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    console.log("click next2 ", playlist.length, " track:", trackId);
    dispatch(setCurrentTrack(trackId));
  };

  const handlClickPrevious = () => {
    console.log("previous");
    trackId = trackId === 0 ? playlist.length - 1 : trackId - 1;
    dispatch(setCurrentTrack(trackId));
  };

  const handleEnd = () => {
    console.log("end");
    trackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(trackId));
  };

  const dispatch = useDispatch();
  console.log({ trackId });

  return (
    <div className={className}>
      <div className="flex-container">
        <div className="left-section">
          {playlist.length > 0 ? playlist[trackId]?.name : "No track selected"}
        </div>
        <div className="mid-section">
          <AudioPlayer
            autoPlayAfterSrcChange={true}
            volume="0.5"
            src={
              playlist.length > 0 && playlist[trackId]?.preview_url
                ? playlist[trackId]?.preview_url
                : ""
            }
            showSkipControls
            onClickNext={handleClickNext}
            onClickPrevious={handlClickPrevious}
            // onEnded={handleEnd}
            onError={(e) => {
              console.log("play error: ", e);
            }}
          />
        </div>
        <div className="right-section">
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default PlayerApp;
