import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import playlistSlice from "../Player/playlistSlice";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "../HomeContent/Player.css";
import { AuthContext } from "../contexts/AuthContext";
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
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    console.log("click next2 ", playlist.length, " track:", newTrackId);
    dispatch(setCurrentTrack(newTrackId));
  };

  const handleClickPrevious = () => {
    if (!auth) return;
    console.log("previous");
    const newTrackId = trackId === 0 ? playlist.length - 1 : trackId - 1;
    dispatch(setCurrentTrack(newTrackId));
  };

  const handleEnd = () => {
    if (!auth) return;
    console.log("end");
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(newTrackId));
  };

  const currentTrack =
    playlist.length > 0 && playlist[trackId] ? playlist[trackId] : null;

  return (
    <div className={className}>
      <div className="flex-container">
        <div className="left-section">
          {currentTrack ? currentTrack.name : "No track selected"}
        </div>
        <div className="mid-section">
          {auth ? (
            <AudioPlayer
              autoPlayAfterSrcChange={true}
              volume="0.5"
              src={
                currentTrack && currentTrack.preview_url
                  ? currentTrack.preview_url
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
