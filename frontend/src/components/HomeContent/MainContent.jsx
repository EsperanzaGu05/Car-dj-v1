import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../HomeContent/MainContent.css";
import TrackInfo from "./TrackInfo";
import AlbumInfo from "./AlbumInfo";
import { setCurrentPlaylist, setCurrentTrack } from "../Player/playlistSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AuthContext } from "../contexts/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MainContent = ({ trackReleases, albumReleases }) => {
<<<<<<< Updated upstream
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  const updatePlaylist = (track) => {
    console.log("Updating playlist with track:", track);
    setCurrentPlaylist([{ 
      name: track.name,
      src: track.preview_url // Make sure this matches the actual property name in your data
    }]);
=======
  const dispatch = useDispatch();
  const { auth } = React.useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const updatePlaylist = (track) => {
    console.log("Updating playlist with track:", track);
    dispatch(setCurrentPlaylist([track]));
    dispatch(setCurrentTrack(track.id));
>>>>>>> Stashed changes
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="content-home">
      <h2>New Songs</h2>
      <div className="content-tracks">
        {(trackReleases && trackReleases.length) > 0 ? (
          <div className="all-tracks">
<<<<<<< Updated upstream
            {trackReleases.map((release) => (
              <TrackInfo 
                key={release.id} 
                release={release} 
                onPlay={() => updatePlaylist(release)}
              />
            ))}
=======
            {trackReleases.map((release, index) => {
              
              return (
                <div key={release.id} className="track-item">
                  <TrackInfo
                    release={release}
                    onPlay={updatePlaylist}
                    showMenu={false}
                  />
                </div>
              );
            })}
>>>>>>> Stashed changes
          </div>
        ) : (
          <p>No tracks available</p>
        )}
      </div>
      <h2>New Albums</h2>
      <div className="content-tracks">
        {(albumReleases && albumReleases.length) > 0 ? (
          <div className="all-albums">
            {albumReleases.map((release) => (
              <AlbumInfo key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <p>No albums available</p>
        )}
      </div>
<<<<<<< Updated upstream
      
      {/* Always render PlayerApp, regardless of playlist content 
      <PlayerApp playlist={currentPlaylist} />*/}
=======
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
>>>>>>> Stashed changes
    </div>
  );
};

export default MainContent;