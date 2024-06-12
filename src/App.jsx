import { useState } from "react";

import "./App.css";
import "./components/LoginSection/Login.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <>
      <div id="main-container">
        <AsideBar />
        <SearchBar />
      </div>
      <footer>Copyright 2024 Car DJ</footer>
    </>
  );
}

export default App;
