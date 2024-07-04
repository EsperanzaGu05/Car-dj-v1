import React from "react";
import Icon from "../Images/Icon";
import "../SearchBar/SearchBar.css";

const SearchBar = ({ className }) => {
  return (
    <div className={className}>
      <form id="search-section">
        <Icon
          src="./src/assets/magnifying-glass.png"
          width="15px"
          height="15px"
        />
        <input type="text" placeholder="Search..." id="input-serch" />
        <Icon src="./src/assets/microphone1.png" width="18px" height="18px" />
      </form>
    </div>
  );
};

export default SearchBar;
