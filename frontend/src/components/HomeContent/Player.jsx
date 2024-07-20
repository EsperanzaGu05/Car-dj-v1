import React, { useContext, useState, useRef, useEffect } from "react";
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

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const playerRef = useRef(null);

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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = playerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    playerRef.current.style.left = `${newX}px`;
    playerRef.current.style.bottom = `${window.innerHeight - newY - playerRef.current.offsetHeight}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = playerRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;
    playerRef.current.style.left = `${newX}px`;
    playerRef.current.style.bottom = `${window.innerHeight - newY - playerRef.current.offsetHeight}px`;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  const currentTrack = playlist.length > 0 && playlist[trackId] ? playlist[trackId] : null;

  return (
    <div 
      ref={playerRef}
      className="player-container"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
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