import { useState } from "react";

import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import SearchBar from "./components/SearchBar/SearchBar";
import LoginForm from "./components/LoginSection/LoginForm";

function App() {
  return (
    <>
      <div id="main-container">
        <AsideBar />
        <SearchBar />
        <LoginForm />
      </div>
      <footer>Copyright 2024 Car DJ</footer>
    </>
  );
}

export default App;
