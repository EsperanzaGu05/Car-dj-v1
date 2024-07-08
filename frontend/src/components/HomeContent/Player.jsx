import React from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../HomeContent/Player.css';

const PlayerApp = ({className, playlist}) => {
    const [currentTrack, setTrackIndex] = React.useState(0)
    const handleClickNext = () => {
        console.log('click next')
          setTrackIndex((currentTrack) =>
              currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
          );
      };
    
    const handleEnd = () => {
      console.log('end')
      setTrackIndex((currentTrack) =>
              currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
          );
    }
    return (
      <div className={className}>
        <div className="flex-container">
          <div className="left-section">{playlist[currentTrack].name}</div>
          <div className="mid-section">
            <AudioPlayer
              autoPlayAfterSrcChange={true}
              volume="0.5"
              src={playlist[currentTrack].src}
              showSkipControls
              onClickNext={handleClickNext}
              onEnded={handleEnd}
              onError={()=> {console.log('play error')}}
              // Try other props!
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