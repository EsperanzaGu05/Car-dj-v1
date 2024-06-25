import React, { useState, useEffect } from "react";

import "./App.css";
import "./components/LoginSection/Login.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import MainContent from "./components/HomeContent/MainContent";
import { getNewRealeases } from "./utils/utils/index";

function App() {
  const [trackReleases, setTrackReleases] = useState();
  const [albumReleases, setAlbumReleases] = useState();

  const fetchRelease = async () => {
    let trackReleases = [];
    let albumReleases = [];

    try {
      // Initial request to get the total number of items
      const initialData = await getNewRealeases();
      if (initialData && initialData.albums && initialData.albums.items) {
        trackReleases = initialData.albums.items.filter(
          (item) => item.album_type === "single"
        );
        albumReleases = initialData.albums.items.filter(
          (item) => item.album_type === "album"
        );
        console.log(trackReleases);
      }
      setTrackReleases(trackReleases);
      setAlbumReleases(albumReleases);
    } catch (error) {
      console.error("Error fetching releases:", error);
    }
  };
  useEffect(() => {
    fetchRelease();
  }, []);

  return (
    <>
      <div id="main-container">
        <AsideBar />
        <div className="main-content-area">
          <SearchBar />
          <MainContent
            trackReleases={trackReleases}
            albumReleases={albumReleases}
          />
        </div>
      </div>
      <footer>Copyright 2024 Car DJ</footer>
    </>
  );
}

export default App;
