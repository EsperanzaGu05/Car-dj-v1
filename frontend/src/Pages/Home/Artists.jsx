import React, { useEffect, useState } from "react";
import { getArtists } from "../../utils/utils";
import ContentArtists from "../../components/Content/ContentArtists";

const Artists = () => {
  const [artists, setArtist] = useState();

  const fetchArtist = async () => {
    const fetchedArtist = await getArtists();
    setArtist(fetchedArtist);
    console.log(fetchedArtist);
  };

  useEffect(() => {
    fetchArtist();
  }, []);

  return <ContentArtists artists={artists} />;
};

export default Artists;
