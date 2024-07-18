import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import playlistSlice from "../Player/playlistSlice";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "../HomeContent/Player.css";
import { AuthContext } from "../contexts/AuthContext"; // Adjust the import path as needed

const PlayerApp = ({ className }) => {
  const { auth } = useContext(AuthContext);
  const playlist = useSelector((state) => state.playlist.playlist);
  const trackId = useSelector((state) => state.playlist.trackid);
  const setCurrentTrack = playlistSlice.actions.setCurrentTrack;
  const dispatch = useDispatch();

  console.log("Rendering PlayerApp with playlist:", playlist);

  const handleClickNext = () => {
    if (!auth) return;
    console.log("click next ", playlist.length, " track:", trackId);
    const trackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    console.log("click next2 ", playlist.length, " track:", trackId);
    dispatch(setCurrentTrack(trackId));
  };

  const handleClickPrevious = () => {
    if (!auth) return;
    console.log("previous");
    const trackId = trackId === 0 ? playlist.length - 1 : trackId - 1;
    dispatch(setCurrentTrack(trackId));
  };

  const handleEnd = () => {
    if (!auth) return;
    console.log("end");
    const trackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(trackId));
  };

  return (
    <div className={className}>
      <div className="flex-container">
        <div className="left-section">
          {playlist.length > 0 ? playlist[trackId].name : "No track selected"}
        </div>
        <div className="mid-section">
          {auth ? (
            <AudioPlayer
              autoPlayAfterSrcChange={true}
              volume="0.5"
              src={
                playlist.length > 0 && playlist[trackId].preview_url
                  ? playlist[trackId].preview_url
                  : ""
              }
              showSkipControls
              onClickNext={handleClickNext}
              onClickPrevious={handleClickPrevious}
              onEnded={handleEnd}
              onError={(e) => {
                console.log("play error: ", e);
              }}
            />
          ) : (
            <div className="login-prompt">
              <p>Please log in to play songs</p>
              {/* You can add a login button or link here */}
            </div>
          )}
        </div>
        <div className="right-section">
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default PlayerApp;
