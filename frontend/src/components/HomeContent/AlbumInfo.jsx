import React from "react";
// import { getArtists } from "../../utils";
import "../HomeContent/MainContent.css";
import { useDispatch } from "react-redux";
import playlistSlice from "../Player/playlistSlice";
import playButtonSrc from "../../assets/play-button.svg";
import {getAlbumTracks} from '../../utils/utils/index';

const AlbumInfo = ({ release }) => {
  const { setCurrentPlaylist, setCurrentTrack} = playlistSlice.actions;
  const dispatch = useDispatch();
  const updatePlayerStatus = async (album) => {    
    try {
      const trackData = await getAlbumTracks(album.id);
      console.log(trackData.items[0].preview_url)
      dispatch(setCurrentPlaylist(trackData.items));
      dispatch(setCurrentTrack(0));
      // QUITAR LOADER
    } catch (error) {
      console.error("Error fetching album tracks:", error);
    }
  };

  return (
    <div className="card-track">
      <div className="play-button">
        <img src={playButtonSrc} alt="" onClick={() => updatePlayerStatus(release)}/>
      </div>
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={release.images[0].url}
          width={"200px"}
          height={"200px"}
          alt={`${release.name}`}
        />
      </div>
      <span>{release.name}</span>
      <span style={{ color: "#222222", opacity: 0.5 }}>
        {release.artists[0].name}
      </span>
    </div>
  );
};

export default AlbumInfo;
