import React, { useEffect, useState } from "react";
import { getNewRealeases } from "../../utils/utils";
import MainContent from "../../components/HomeContent/MainContent";

const Home = () => {
  const [trackReleases, setTrackReleases] = useState([]);
  const [albumReleases, setAlbumReleases] = useState([]);

  const fetchRelease = async () => {
    try {
      const initialData = await getNewRealeases();
      if (initialData && initialData.albums && initialData.albums.items) {
        // Filter releases according to market
        const trackReleases = initialData.albums.items
          .filter(item => item.album_type === "single" && item.available_markets.includes("CA"));
        const albumReleases = initialData.albums.items
          .filter(item => item.album_type === "album" && item.available_markets.includes("CA"));
        setTrackReleases(trackReleases);
        setAlbumReleases(albumReleases);
      }
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
