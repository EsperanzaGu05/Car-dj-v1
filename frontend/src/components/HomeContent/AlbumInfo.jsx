import React from "react";
import { Link } from "react-router-dom";
import "../HomeContent/MainContent.css";
import { useDispatch } from "react-redux";
import { setCurrentPlaylist, setCurrentTrack } from "../Player/playlistSlice";
import playButtonSrc from "../../assets/play-button.svg";
import { getAlbumTracks } from "../../utils/utils/index";

const AlbumInfo = ({ release }) => {

  const dispatch = useDispatch();


  const { setCurrentPlaylist, setCurrentTrack } = playlistSlice.actions;
 

  const updatePlayerStatus = async (album) => {
    try {
      const trackData = await getAlbumTracks(album.id);
      console.log(trackData.items[0].preview_url);
      dispatch(setCurrentPlaylist(trackData.items));
      dispatch(setCurrentTrack(0));
      // QUITAR LOADER
    } catch (error) {
      console.error("Error fetching album tracks:", error);
    }
  };

  return (
    <div className="card-track">
      <Link to={`/albums/${release.id}`} className="redirect-detailes">
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
        <div style={{ height: "25px", overflow: "hidden" }}>
          <span>{release.name}</span>
        </div>
        <span style={{ color: "#222222", opacity: 0.5 }}>
          {release.artists[0].name}
        </span>
      </Link>
    </div>
  );
};

export default AlbumInfo;