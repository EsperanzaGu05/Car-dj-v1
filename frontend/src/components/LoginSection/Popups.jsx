import React from 'react';
import './Popup.css'; // Assuming the CSS for Popup is in Popup.css

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="success-alert">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
