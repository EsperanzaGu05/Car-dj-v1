import React, { useEffect, useState } from "react";
import { getNewRealeases } from "../../utils/utils";
import MainContent from "../../components/HomeContent/MainContent";

const Home = () => {
  const [trackReleases, setTrackReleases] = useState();
  const [albumReleases, setAlbumReleases] = useState();

  const fetchRelease = async () => {
    let trackReleases = [];
    let albumReleases = [];

    try {
      // Initial request to get the total number of items
      // ACTIVAR LOADER
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
      // QUITAR LOADER
    } catch (error) {
      console.error("Error fetching releases:", error);
    }
  };
  useEffect(() => {
    fetchRelease();
  }, []);

  return (
    <MainContent trackReleases={trackReleases} albumReleases={albumReleases} />
  );
};

export default Home;
