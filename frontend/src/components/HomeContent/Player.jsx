import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import playlistSlice from "../Player/playlistSlice";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../HomeContent/Player.css';

const PlayerApp = ({className}) => {
  let playlist = useSelector((state)=> state.playlist.playlist);
  let trackId = useSelector((state)=> state.playlist.trackid);
  const setCurrentTrack = playlistSlice.actions.setCurrentTrack;

    const handleClickNext = () => {
      console.log('click next');
      trackId < playlist.length - 1 ? trackId + 1 : 0;
      dispatch(setCurrentTrack(trackId));
    };
    
    const handleEnd = () => {
      console.log('end');
      trackId < playlist.length - 1 ? trackId + 1 : 0;
      dispatch(setCurrentTrack(trackId));
    } 
    
    const dispatch = useDispatch();

    return (
      <div className={className}>
        <div className="flex-container">
          <div className="left-section">{playlist[trackId].name}</div>
          <div className="mid-section">
            <AudioPlayer
              autoPlayAfterSrcChange={true}
              volume="0.5"
              src={playlist[trackId].preview_url}
              showSkipControls
              onClickNext={handleClickNext}
              onEnded={handleEnd}
              onError={()=> {console.log('play error')}}
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