import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
<<<<<<< Updated upstream
import playlistSlice from "../Player/playlistSlice";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../HomeContent/Player.css';
import { AuthContext } from "../contexts/AuthContext"; // Adjust the import path as needed

const PlayerApp = ({className}) => {
=======
import { setCurrentTrack } from "../Player/playlistSlice";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../HomeContent/Player.css';
import { AuthContext } from "../contexts/AuthContext";

const PlayerApp = () => {
>>>>>>> Stashed changes
  const { auth } = useContext(AuthContext);
  const playlist = useSelector((state) => state.playlist.playlist || []);
  const trackId = useSelector((state) => state.playlist.trackid || 0);
  const dispatch = useDispatch();

  const handleClickNext = () => {
<<<<<<< Updated upstream
    if (!auth) return;
    console.log('click next ', playlist.length, ' track:', trackId);
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    console.log('click next2 ', playlist.length, ' track:', newTrackId);
=======
    if (!auth || !playlist.length) return;
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
>>>>>>> Stashed changes
    dispatch(setCurrentTrack(newTrackId));
  };

  const handleClickPrevious = () => {
<<<<<<< Updated upstream
    if (!auth) return;
    console.log('previous');
=======
    if (!auth || !playlist.length) return;
>>>>>>> Stashed changes
    const newTrackId = trackId === 0 ? playlist.length - 1 : trackId - 1;
    dispatch(setCurrentTrack(newTrackId));
  };

  const handleEnd = () => {
<<<<<<< Updated upstream
    if (!auth) return;
    console.log('end');
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(newTrackId));
  }
=======
    if (!auth || !playlist.length) return;
    const newTrackId = trackId < playlist.length - 1 ? trackId + 1 : 0;
    dispatch(setCurrentTrack(newTrackId));
  };

  const currentTrack = playlist.length > 0 && playlist[trackId] ? playlist[trackId] : null;
>>>>>>> Stashed changes

  return (
    <div className="player-container">
      <div className="flex-container">
        <div className="left-section">
          {playlist.length > 0 ? playlist[trackId].name : "No track selected"}
        </div>
        <div className="mid-section">
          {auth ? (
            <AudioPlayer
              autoPlayAfterSrcChange={true}
<<<<<<< Updated upstream
              volume="0.5"
              src={playlist.length > 0 && playlist[trackId].preview_url ? playlist[trackId].preview_url : ""}
=======
              volume={0.5}
              src={currentTrack && currentTrack.preview_url ? currentTrack.preview_url : ""}
>>>>>>> Stashed changes
              showSkipControls
              showJumpControls={true}
              showFilledVolume={true}
              onClickNext={handleClickNext}
              onClickPrevious={handleClickPrevious}
              onEnded={handleEnd}
<<<<<<< Updated upstream
              onError={(e) => {console.log('play error: ', e)}}
=======
              onError={(e) => { console.log('play error: ', e) }}
>>>>>>> Stashed changes
            />
          ) : (
            <div className="login-prompt">
              <p>Please log in to play songs</p>
              {/* You can add a login button or link here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerApp;