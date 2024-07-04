import React, { useEffect, useState } from "react";
import "./Home.css";
import { getArtists } from "../../utils/utils";
import ContentArtists from "../../components/Content/ContentArtists";

const Artists = () => {
  const [artists, setArtist] = useState();

  const fetchArtist = async () => {
    const fetchedArtist = await getArtists();
    setArtist(fetchedArtist);
    console.log(artists);
  };

  useEffect(() => {
    fetchArtist();
  }, []);

  return <ContentArtists artists={artists} />;
};

export default Artists;
