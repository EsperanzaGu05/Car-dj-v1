import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTrack } from "../Player/playlistSlice";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../HomeContent/Player.css';
import { AuthContext } from "../contexts/AuthContext";

const PlayerApp = () => {
  const { auth } = useContext(AuthContext);
  const playlist = useSelector((state) => state.playlist.playlist || []);
  const trackId = useSelector((state) => state.playlist.trackid || 0);
  const dispatch = useDispatch();

  const handleClickNext = () => {
    if (!auth || !playlist.length) return;
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(newTrackId));
  };

  const handleClickPrevious = () => {
    if (!auth || !playlist.length) return;
    const newTrackId = trackId === 0 ? playlist.length - 1 : trackId - 1;
    dispatch(setCurrentTrack(newTrackId));
  };

  const handleEnd = () => {
    if (!auth || !playlist.length) return;
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(newTrackId));
  };

  const currentTrack = playlist.length > 0 && playlist[trackId] ? playlist[trackId] : null;

  return (
    <div className="player-container">
      <div className="flex-container">
        <div className="left-section">
          {currentTrack ? currentTrack.name : "No track selected"}
        </div>
        <div className="mid-section">
          {auth ? (
            <AudioPlayer
              autoPlayAfterSrcChange={true}
              volume={0.5}
              src={currentTrack && currentTrack.preview_url ? currentTrack.preview_url : ""}
              showSkipControls
              showJumpControls={true}
              showFilledVolume={true}
              onClickNext={handleClickNext}
              onClickPrevious={handleClickPrevious}
              onEnded={handleEnd}
              onError={(e) => { console.log('play error: ', e) }}
            />
          ) : (
            <div className="login-prompt">
              <p>Please log in to play songs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerApp;