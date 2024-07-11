import React, { useState, useEffect } from "react";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({ className, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let recognition = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Spoken words:", transcript); // Log the transcript to console
        setSearchQuery(transcript);
        setIsListening(false);
        handleSearch(null, transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognition) recognition.abort();
    };
  }, []);

  const handleSearch = (e, voiceInput = null) => {
    if (e) e.preventDefault();
    const query = voiceInput || searchQuery.trim();
    if (query) {
      onSearch(query);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      setIsListening(true);
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Spoken words:", transcript); // Log the transcript to console
        setSearchQuery(transcript);
        setIsListening(false);
        handleSearch(null, transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <div className={className}>
      <form id="search-section" onSubmit={handleSearch}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          id="input-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch(e);
          }}
        />
        <FaMicrophone
          className={`microphone-icon ${isListening ? 'listening' : ''}`}
          onClick={startListening}
          style={{ cursor: 'pointer' }}
        />
      </form>
    </div>
  );
};

export default SearchBar;
