import React, { useEffect, useState } from "react";
import { getPlaylists } from "../../utils/utils";
import ContentPlaylists from "../../components/Content/ContentPlaylists";
const Playlists = () => {
  const [playlists, setPlaylists] = useState();

  const fetchPlaylist = async () => {
    let playlists = [];

    try {
      const initialData = await getPlaylists();
      if (initialData && initialData.playlists && initialData.playlists.items) {
        playlists = initialData.playlists.items;
      }
      setPlaylists(playlists);
      console.log(playlists);
    } catch (error) {
      console.error("Error fetching releases:", error);
    }
  };
  useEffect(() => {
    fetchPlaylist();
  }, []);

  return <ContentPlaylists playlists={playlists} />;
};

export default Playlists;
