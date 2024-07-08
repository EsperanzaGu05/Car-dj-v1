import React from "react";
import AsideBar from "../../components/AsideBar/AsideBar";
import "./Layout.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import PlayerApp from "../../components/HomeContent/Player";

const Layout = ({ children, id, playlist }) => {
  return (
    <section className="layout-container">
      <AsideBar className="layout-container__aside" id={id} />
      <SearchBar className="layout-container__search" />
      <article className="layout-container__content">{children}</article>
      <PlayerApp className="layout-container__player" playlist={playlist}></PlayerApp>
    </section>
  );
};

export default Layout;
