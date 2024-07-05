import React, { useEffect, useState } from "react";
import { getAlbums } from "../../utils/utils";
import ContentAlbums from "../../components/Content/ContentAlbums";
const Albums = () => {
  const [albums, setAlbums] = useState();

  const fetchAlbum = async () => {
    const fetchedAlbum = await getAlbums();
    setAlbums(fetchedAlbum);
    console.log(fetchedAlbum);
  };
  useEffect(() => {
    fetchAlbum();
  }, []);

  return <ContentAlbums albums={albums} />;
};

export default Albums;
