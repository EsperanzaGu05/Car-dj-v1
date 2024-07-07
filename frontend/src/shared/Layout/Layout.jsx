import React from "react";
import AsideBar from "../../components/AsideBar/AsideBar";
import "./Layout.css";
import SearchBar from "../../components/SearchBar/SearchBar";

const Layout = ({ children, id }) => {
  return (
    <section className="layout-container">
      <AsideBar className="layout-container__aside" id={id} />
      <SearchBar className="layout-container__search" />
      <article className="layout-container__content">{children}</article>
    </section>
  );
};

export default Layout;
